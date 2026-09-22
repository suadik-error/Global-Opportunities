import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  duration: String,
  summary: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'draft', index: true },
  bannerImage: String,
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, required: true }, // e.g. seekers, hirers, all
  sentAt: String,
}, { timestamps: true });

export const Article = mongoose.model('Article', articleSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
