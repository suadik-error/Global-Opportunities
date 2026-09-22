import { Router } from 'express';
import mongoose from 'mongoose';
import { authRouter } from './auth.js';
import { uploadRouter } from './upload.js';
import { asyncHandler, itemResponse, listResponse, notFound } from '../utils/http.js';
import { User, StaffMember } from '../models/User.js';
import { SeekerProfile, HirerAccount, Candidate } from '../models/Profiles.js';
import {
  Opportunity, Applicant, Event, Grant,
  GrantApplication, CompanyVerification, VerificationDoc
} from '../models/Platform.js';
import { Channel, ChannelPost, Report } from '../models/Community.js';
import { Article, Notification } from '../models/Content.js';

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
    ...toClientObject(profile),
    technicalSkills: parseJson(profile.technicalSkills),
    softSkills: parseJson(profile.softSkills),
    tools: parseJson(profile.tools),
    certifications: parseJson(profile.certifications),
  };

const withParsedOpportunity = (opportunity) =>
  opportunity && {
    ...toClientObject(opportunity),
    experienceLevels: parseJson(opportunity.experienceLevels),
  };

const withParsedCandidate = (candidate) =>
  candidate && {
    ...toClientObject(candidate),
    skills: parseJson(candidate.skills),
  };

const toClientObject = (document) => {
  if (!document) return null;
  const value = document.toJSON ? document.toJSON() : document;
  return {
    id: value.id || value._id?.toString(),
    ...value,
    _id: undefined,
    __v: undefined,
  };
};

const collectionRoutes = ({ Model, resourceName, normalizeIn, normalizeOut, searchFields = [] }) => {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const { status, type, q } = req.query;
      const filter = {};

      if (status) {
        if (resourceName === 'Company verification') filter.overallStatus = status;
        else if (resourceName === 'Opportunity') filter.moderationStatus = status;
        else filter.status = status;
      }

      if (type && resourceName === 'Opportunity') filter.type = type;

      if (q) {
        const query = String(q);
        filter.$or = searchFields.map((field) => ({ [field]: { $regex: query, $options: 'i' } }));
      }

      const data = await Model.find(filter).sort({ createdAt: -1 });
      listResponse(res, normalizeOut ? data.map(normalizeOut) : data.map(toClientObject));
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) throw notFound(resourceName);
      itemResponse(res, normalizeOut ? normalizeOut(item) : toClientObject(item));
    }),
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const data = normalizeIn ? normalizeIn(req.body) : req.body;
      const item = new Model(data);
      await item.save();
      res.status(201).json({ data: normalizeOut ? normalizeOut(item) : toClientObject(item) });
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const data = normalizeIn ? normalizeIn(req.body) : req.body;
      const item = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!item) throw notFound(resourceName);
      itemResponse(res, normalizeOut ? normalizeOut(item) : toClientObject(item));
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await Model.findByIdAndDelete(req.params.id);
      res.status(204).send();
    }),
  );

  return router;
};

apiRouter.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbStatus === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'error',
    service: 'kredibble-backend',
    database: {
      status: statusMap[dbStatus] || 'unknown',
      connected: isHealthy,
    },
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/dashboard/summary', asyncHandler(async (req, res) => {
  const [
    pendingVerifications,
    pendingOpportunities,
    activeSeekers,
    activeHirers,
    openReports,
    totalUsers,
    totalOpportunities,
  ] = await Promise.all([
    CompanyVerification.countDocuments({ overallStatus: 'pending' }),
    Opportunity.countDocuments({ moderationStatus: 'pending' }),
    SeekerProfile.countDocuments({ status: 'active' }),
    HirerAccount.countDocuments({ status: 'active' }),
    Report.countDocuments({ status: 'open' }),
    User.countDocuments(),
    Opportunity.countDocuments(),
  ]);

  itemResponse(res, {
    pendingVerifications,
    pendingOpportunities,
    activeSeekers,
    activeHirers,
    openReports,
    totalUsers,
    totalOpportunities,
  });
}));

apiRouter.use('/auth', authRouter);
apiRouter.use('/upload', uploadRouter);

// Resource Routes
apiRouter.use('/users', collectionRoutes({ Model: User, resourceName: 'User', searchFields: ['name', 'email'] }));
apiRouter.use('/staff', collectionRoutes({ Model: StaffMember, resourceName: 'Staff', searchFields: ['name', 'email'] }));
apiRouter.use('/seekers', collectionRoutes({
  Model: SeekerProfile,
  resourceName: 'Seeker',
  normalizeIn: (data) => stringifyArrayFields(data, ['technicalSkills', 'softSkills', 'tools', 'certifications']),
  normalizeOut: withParsedProfile,
  searchFields: ['profession', 'university', 'country']
}));
apiRouter.use('/hirers', collectionRoutes({ Model: HirerAccount, resourceName: 'Hirer', searchFields: ['companyName', 'industry'] }));
apiRouter.use('/opportunities', collectionRoutes({
  Model: Opportunity,
  resourceName: 'Opportunity',
  normalizeIn: (data) => stringifyArrayFields(data, ['experienceLevels']),
  normalizeOut: withParsedOpportunity,
  searchFields: ['title', 'company', 'location']
}));
apiRouter.use('/candidates', collectionRoutes({
  Model: Candidate,
  resourceName: 'Candidate',
  normalizeIn: (data) => stringifyArrayFields(data, ['skills']),
  normalizeOut: withParsedCandidate,
  searchFields: ['name', 'profession']
}));
apiRouter.use('/community/channels', collectionRoutes({ Model: Channel, resourceName: 'Channel', searchFields: ['name', 'category'] }));
apiRouter.use('/reports', collectionRoutes({ Model: Report, resourceName: 'Report', searchFields: ['reason', 'details'] }));
apiRouter.use('/events', collectionRoutes({ Model: Event, resourceName: 'Event', searchFields: ['title', 'location'] }));
apiRouter.use('/grants', collectionRoutes({ Model: Grant, resourceName: 'Grant', searchFields: ['title', 'sector'] }));
apiRouter.use('/articles', collectionRoutes({ Model: Article, resourceName: 'Article', searchFields: ['title', 'category'] }));
apiRouter.use('/notifications', collectionRoutes({ Model: Notification, resourceName: 'Notification', searchFields: ['title', 'message'] }));
apiRouter.use('/verification/companies', collectionRoutes({ Model: CompanyVerification, resourceName: 'Company verification', searchFields: ['name', 'industry'] }));

// Special nested routes
apiRouter.post('/opportunities/:opportunityId/applicants', asyncHandler(async (req, res) => {
    const applicant = new Applicant({
      ...stringifyArrayFields(req.body, ['skills']),
      opportunityId: req.params.opportunityId,
    });
    await applicant.save();
    await Opportunity.findByIdAndUpdate(req.params.opportunityId, { $inc: { applicantsCount: 1 } });
    res.status(201).json({ data: applicant });
}));

apiRouter.post('/community/channels/:channelId/posts', asyncHandler(async (req, res) => {
    const post = new ChannelPost({
      ...req.body,
      channelId: req.params.channelId,
    });
    await post.save();
    await Channel.findByIdAndUpdate(req.params.channelId, { $inc: { postsCount: 1 } });
    res.status(201).json({ data: post });
}));
