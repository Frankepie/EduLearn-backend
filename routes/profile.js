const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Profile = require('../models/Profile');
const protect =
  require("../middleware/authMiddleware");
// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP images are allowed'), false);
    }
  }
});

// GET profile
router.get('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      profile = new Profile({
        user: req.userId,
        firstName: '',
        lastName: '',
        profileImage: null,
        bio: ''
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE profile
router.put('/', protect, async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    
    let profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      profile = new Profile({
        user: req.userId,
        firstName,
        lastName,
        bio: bio || ''
      });
    } else {
      profile.firstName = firstName;
      profile.lastName = lastName;
      if (bio !== undefined) profile.bio = bio;
      profile.updatedAt = Date.now();
    }
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD profile image
router.post('/upload-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Create filename
    const filename = `profile-${req.userId}-${Date.now()}.jpg`;
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, processedImage);

    // Delete old profile image if exists
    const profile = await Profile.findOne({ user: req.userId });
    if (profile && profile.profileImage) {
      const oldImagePath = path.join(__dirname, '..', profile.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update profile
    const imageUrl = `/uploads/profiles/${filename}`;
    
    let updatedProfile = await Profile.findOne({ user: req.userId });
    if (!updatedProfile) {
      updatedProfile = new Profile({
        user: req.userId,
        firstName: '',
        lastName: '',
        profileImage: imageUrl
      });
    } else {
      updatedProfile.profileImage = imageUrl;
      updatedProfile.updatedAt = Date.now();
    }
    
    await updatedProfile.save();
    
    res.json({
      message: 'Image uploaded successfully',
      profileImage: imageUrl,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// DELETE profile image
router.delete('/image', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (profile && profile.profileImage) {
      const imagePath = path.join(__dirname, '..', profile.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      profile.profileImage = null;
      await profile.save();
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;