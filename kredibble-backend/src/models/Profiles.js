import mongoose from 'mongoose';

const seekerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  profession: { type: String, required: true },
  university: String,
  country: String,
  city: String,
  phone: String,
  rating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  bio: String,
  professionalSummary: String,
  experienceLevel: String,
  technicalSkills: { type: String, default: '[]' },
  softSkills: { type: String, default: '[]' },
  tools: { type: String, default: '[]' },
  certifications: { type: String, default: '[]' },
  status: { type: String, default: 'active' },
  joinedDate: String,
  applicationsCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
}, { timestamps: true });

const hirerAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  companyName: { type: String, required: true },
  tagline: String,
  logo: String,
  bannerImage: String,
  industry: { type: String, required: true },
  companySize: String,
  location: { type: String, required: true },
  website: String,
  companyEmail: { type: String, required: true },
  description: String,
  recruiterName: String,
  recruiterRole: String,
  recruiterEmail: String,
  recruiterPhone: String,
  recruiterLinkedin: String,
  verification: { type: String, default: 'pending' },
  verified: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  joinedDate: String,
  postingsCount: { type: Number, default: 0 },
  publicCompanyProfile: { type: Boolean, default: true },
}, { timestamps: true });

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  university: String,
  location: String,
  image: String,
  matchScore: { type: Number, default: 0 },
  skills: { type: String, default: '[]' },
  bio: String,
}, { timestamps: true });

export const SeekerProfile = mongoose.model('SeekerProfile', seekerProfileSchema);
export const HirerAccount = mongoose.model('HirerAccount', hirerAccountSchema);
export const Candidate = mongoose.model('Candidate', candidateSchema);
