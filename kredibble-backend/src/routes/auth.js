import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { collections } from '../lib/mongodb.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.js';
import { ApiError, asyncHandler, itemResponse } from '../utils/http.js';

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per windowMs for auth routes
  message: { error: { message: 'Too many requests from this IP, please try again after 15 minutes' } },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

authRouter.use(authLimiter);

const publicUser = (user) => {
  if (!user) return null;
  const { passwordHash, _id, ...safeUser } = user;
  return { id: _id, ...safeUser };
};

authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const users = collections.users();
    const existing = await users.findOne({ email });
    if (existing) throw new ApiError(409, 'A user with that email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    const userData = {
      _id: userId,
      name,
      email,
      role,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (role === 'seeker') {
      const seekerData = {
        _id: uuidv4(),
        userId,
        profession: req.body.profession || 'Opportunity Seeker',
        university: req.body.university,
        country: req.body.country,
        city: req.body.city,
        phone: req.body.phone,
        technicalSkills: Array.isArray(req.body.technicalSkills)
          ? JSON.stringify(req.body.technicalSkills)
          : '[]',
        rating: 0,
        verified: false,
        status: 'active',
        applicationsCount: 0,
        savedCount: 0,
      };
      await collections.seekers().insertOne(seekerData);
      userData.seeker = seekerData;
    } else if (role === 'hirer') {
      const hirerData = {
        _id: uuidv4(),
        userId,
        companyName: req.body.companyName || name,
        industry: req.body.industry || 'Not specified',
        location: req.body.location || 'Not specified',
        website: req.body.website,
        companySize: req.body.companySize,
        companyEmail: req.body.companyEmail || email,
        recruiterName: name,
        recruiterRole: req.body.recruiterRole,
        recruiterEmail: email,
        recruiterPhone: req.body.recruiterPhone,
        recruiterLinkedin: req.body.recruiterLinkedin,
        verification: 'pending',
        verified: false,
        status: 'active',
        postingsCount: 0,
        publicCompanyProfile: true,
      };
      await collections.hirers().insertOne(hirerData);
      userData.hirer = hirerData;
    }

    await users.insertOne(userData);

    res.status(201).json({ data: { user: publicUser(userData), token: signToken(userData) } });
  }),
);

authRouter.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await collections.users().findOne({ email });
    if (!user?.passwordHash) throw new ApiError(401, 'Invalid email or password');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    // Fetch related profiles if they aren't already embedded
    if (!user.seeker && user.role === 'seeker') {
      user.seeker = await collections.seekers().findOne({ userId: user._id });
    }
    if (!user.hirer && user.role === 'hirer') {
      user.hirer = await collections.hirers().findOne({ userId: user._id });
    }
    if (!user.staff && user.role === 'admin') {
      user.staff = await collections.staff().findOne({ userId: user._id });
    }

    res.json({ data: { user: publicUser(user), token: signToken(user) } });
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await collections.users().findOne({ _id: req.auth.sub });
    if (!user) throw new ApiError(404, 'User not found');

    if (!user.seeker && user.role === 'seeker') {
      user.seeker = await collections.seekers().findOne({ userId: user._id });
    }
    if (!user.hirer && user.role === 'hirer') {
      user.hirer = await collections.hirers().findOne({ userId: user._id });
    }
    if (!user.staff && user.role === 'admin') {
      user.staff = await collections.staff().findOne({ userId: user._id });
    }

    itemResponse(res, publicUser(user));
  }),
);
