import Profile from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    // Create default profile if none exists
    profile = await Profile.create({
      name: 'Engineer',
      title: 'Software Engineer',
      bio: 'Building scalable systems.',
    });
  }

  res.json(profile);
});

/**
 * Update profile (admin only)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, title, bio, avatar, systemDescription, uptime, systemStatus } =
    req.body;

  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    // Update fields
    if (name !== undefined) profile.name = name;
    if (title !== undefined) profile.title = title;
    if (bio !== undefined) profile.bio = bio;
    if (avatar !== undefined) profile.avatar = avatar;
    if (systemDescription !== undefined)
      profile.systemDescription = systemDescription;
    if (uptime !== undefined) profile.uptime = uptime;
    if (systemStatus !== undefined) profile.systemStatus = systemStatus;

    await profile.save();
  }

  res.json(profile);
});
