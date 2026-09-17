import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { collections } from '../lib/mongodb.js';
import { authRouter } from './auth.js';
import { uploadRouter } from './upload.js';
import { asyncHandler, itemResponse, listResponse, notFound } from '../utils/http.js';

export const apiRouter = Router();

const parseJson = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const stringifyArrayFields = (data, fields) => {
  const next = { ...data };
  for (const field of fields) {
    if (Array.isArray(next[field])) next[field] = JSON.stringify(next[field]);
  }
  return next;
};

const withParsedProfile = (profile) =>
  profile && {
    ...profile,
    id: profile._id,
    technicalSkills: parseJson(profile.technicalSkills),
    softSkills: parseJson(profile.softSkills),
    tools: parseJson(profile.tools),
    certifications: parseJson(profile.certifications),
  };

const withParsedOpportunity = (opportunity) =>
  opportunity && {
    ...opportunity,
    id: opportunity._id,
    experienceLevels: parseJson(opportunity.experienceLevels),
    applicants: opportunity.applicants?.map((applicant) => ({
      ...applicant,
      id: applicant._id,
      skills: parseJson(applicant.skills),
    })),
  };

const withParsedCandidate = (candidate) =>
  candidate && {
    ...candidate,
    id: candidate._id,
    skills: parseJson(candidate.skills),
  };

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const collectionRoutes = ({ collectionName, resourceName, normalizeIn, normalizeOut, searchFields = [] }) => {
  const router = Router();
  const getCol = collections[collectionName];

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const { status, type, q } = req.query;
      const filter = {};
      if (status) {
        if (collectionName === 'verifications') filter.overallStatus = status;
        else if (collectionName === 'opportunities') filter.moderationStatus = status;
        else filter.status = status;
      }
      if (type) {
        if (collectionName === 'opportunities') filter.type = type;
        if (collectionName === 'reports') filter.targetType = type;
      }
      if (q) {
        const query = escapeRegex(String(q));
        filter.$or = searchFields.map((field) => ({ [field]: { $regex: query, $options: 'i' } }));
      }
      const data = await getCol().find(filter).sort({ _id: 1 }).toArray();
      const mapped = data.map(item => ({ id: item._id, ...item }));
      listResponse(res, normalizeOut ? mapped.map(normalizeOut) : mapped);
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = await getCol().findOne({ _id: req.params.id });
      if (!item) throw notFound(resourceName);
      const mapped = { id: item._id, ...item };
      itemResponse(res, normalizeOut ? normalizeOut(mapped) : mapped);
    }),
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const data = normalizeIn ? normalizeIn(req.body) : req.body;
      const newItem = { _id: uuidv4(), ...data, createdAt: new Date(), updatedAt: new Date() };
      await getCol().insertOne(newItem);
      const mapped = { id: newItem._id, ...newItem };
      res.status(201).json({ data: normalizeOut ? normalizeOut(mapped) : mapped });
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const data = normalizeIn ? normalizeIn(req.body) : req.body;
      const updateData = { ...data, updatedAt: new Date() };
      delete updateData._id;
      delete updateData.id;

      const result = await getCol().findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) throw notFound(resourceName);
      const mapped = { id: result._id, ...result };
      itemResponse(res, normalizeOut ? normalizeOut(mapped) : mapped);
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await getCol().deleteOne({ _id: req.params.id });
      res.status(204).send();
    }),
  );

  return router;
};

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kredibble-backend' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/upload', uploadRouter);

apiRouter.get(
  '/dashboard/summary',
  asyncHandler(async (req, res) => {
    const [pendingVerifications, pendingOpportunities, openReports, activeSeekers, activeHirers] = await Promise.all([
      collections.verifications().countDocuments({ overallStatus: 'pending' }),
      collections.opportunities().countDocuments({ moderationStatus: 'pending' }),
      collections.reports().countDocuments({ status: 'open' }),
      collections.seekers().countDocuments({ status: 'active' }),
      collections.hirers().countDocuments({ status: 'active' }),
    ]);

    res.json({
      data: {
        pendingVerifications,
        pendingOpportunities,
        openReports,
        activeSeekers,
        activeHirers,
      },
    });
  }),
);

apiRouter.use(
  '/users',
  collectionRoutes({
    collectionName: 'users',
    resourceName: 'User',
    searchFields: ['name', 'email'],
  }),
);

apiRouter.use(
  '/seekers',
  collectionRoutes({
    collectionName: 'seekers',
    resourceName: 'Seeker',
    normalizeIn: (data) => stringifyArrayFields(data, ['technicalSkills', 'softSkills', 'tools', 'certifications']),
    normalizeOut: withParsedProfile,
    searchFields: ['profession', 'university', 'country', 'city'],
  }),
);

apiRouter.use(
  '/hirers',
  collectionRoutes({
    collectionName: 'hirers',
    resourceName: 'Hirer',
    searchFields: ['companyName', 'recruiterName', 'recruiterEmail', 'industry', 'location'],
  }),
);

apiRouter.use(
  '/verification/companies',
  collectionRoutes({
    collectionName: 'verifications',
    resourceName: 'Company verification',
    searchFields: ['name', 'companyEmail', 'recruiterName', 'recruiterEmail', 'industry', 'location'],
  }),
);

apiRouter.patch(
  '/verification/companies/:companyId/docs/:docKey',
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.companyId, 'docs.key': req.params.docKey };
    const update = { $set: { 'docs.$': { ...req.body, key: req.params.docKey } } };

    const result = await collections.verifications().findOneAndUpdate(
      filter,
      update,
      { returnDocument: 'after' }
    );
    itemResponse(res, result?.docs?.find(d => d.key === req.params.docKey));
  }),
);

apiRouter.use(
  '/opportunities',
  collectionRoutes({
    collectionName: 'opportunities',
    resourceName: 'Opportunity',
    normalizeIn: (data) => stringifyArrayFields(data, ['experienceLevels']),
    normalizeOut: withParsedOpportunity,
    searchFields: ['title', 'company', 'location', 'description'],
  }),
);

apiRouter.post(
  '/opportunities/:opportunityId/applicants',
  asyncHandler(async (req, res) => {
    const applicant = {
      _id: uuidv4(),
      ...stringifyArrayFields(req.body, ['skills']),
      opportunityId: req.params.opportunityId,
      createdAt: new Date(),
    };
    await collections.applicants().insertOne(applicant);
    await collections.opportunities().updateOne(
      { _id: req.params.opportunityId },
      { $inc: { applicantsCount: 1 } }
    );
    res.status(201).json({ data: { ...applicant, id: applicant._id, skills: parseJson(applicant.skills) } });
  }),
);

apiRouter.patch(
  '/opportunities/:opportunityId/applicants/:applicantId',
  asyncHandler(async (req, res) => {
    const data = stringifyArrayFields(req.body, ['skills']);
    const result = await collections.applicants().findOneAndUpdate(
      { _id: req.params.applicantId },
      { $set: data },
      { returnDocument: 'after' }
    );
    itemResponse(res, { ...result, id: result._id, skills: parseJson(result.skills) });
  }),
);

apiRouter.use(
  '/candidates',
  collectionRoutes({
    collectionName: 'candidates',
    resourceName: 'Candidate',
    normalizeIn: (data) => stringifyArrayFields(data, ['skills']),
    normalizeOut: withParsedCandidate,
    searchFields: ['name', 'profession', 'university', 'location'],
  }),
);

apiRouter.use(
  '/reports',
  collectionRoutes({
    collectionName: 'reports',
    resourceName: 'Report',
    searchFields: ['targetLabel', 'reporterName', 'reason', 'details'],
  }),
);

apiRouter.use(
  '/community/channels',
  collectionRoutes({
    collectionName: 'channels',
    resourceName: 'Channel',
    searchFields: ['name', 'owner', 'category'],
  }),
);

apiRouter.post(
  '/community/channels/:channelId/posts',
  asyncHandler(async (req, res) => {
    const post = {
      _id: uuidv4(),
      ...req.body,
      channelId: req.params.channelId,
      createdAt: new Date(),
    };
    await collections.posts().insertOne(post);
    await collections.channels().updateOne(
      { _id: req.params.channelId },
      { $inc: { postsCount: 1 } }
    );
    res.status(201).json({ data: { ...post, id: post._id } });
  }),
);

apiRouter.use(
  '/events',
  collectionRoutes({
    collectionName: 'events',
    resourceName: 'Event',
    searchFields: ['title', 'hirer', 'location'],
  }),
);

apiRouter.use(
  '/grants',
  collectionRoutes({
    collectionName: 'grants',
    resourceName: 'Grant',
    searchFields: ['title', 'hirer', 'sector'],
  }),
);

apiRouter.patch(
  '/grants/:grantId/applications/:applicationId',
  asyncHandler(async (req, res) => {
    // Note: This assumes applications are stored in a separate collection
    // In the previous Prisma schema they were related to Grant.
    // I'll assume there's an 'applications' property in the Grant document or a separate collection.
    // Given Prisma schema: model GrantApplication { ... grant Grant @relation(...) }
    // So it's a separate collection.
    const result = await collections.grantApplications().findOneAndUpdate(
      { _id: req.params.applicationId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    itemResponse(res, { ...result, id: result._id });
  }),
);

apiRouter.use(
  '/articles',
  collectionRoutes({
    collectionName: 'articles',
    resourceName: 'Article',
    searchFields: ['category', 'title', 'summary', 'content'],
  }),
);

apiRouter.use(
  '/staff',
  collectionRoutes({
    collectionName: 'staff',
    resourceName: 'Staff member',
    searchFields: ['name', 'email'],
  }),
);

apiRouter.use(
  '/notifications',
  collectionRoutes({
    collectionName: 'notifications',
    resourceName: 'Notification',
    searchFields: ['title', 'message'],
  }),
);
