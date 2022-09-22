const express = require('express');
const router = express.Router();
const User = require('../../config/models/User');
const Profile = require('../../config/models/Profile');
const mid = require('../../middleware/mid');
const { body, validationResult } = require('express-validator');
//  Route   Get profile/me
//  Desc    Get current user profile
//  Access  Public
router.get('/me', mid, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No Profile For This User' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
//  Route  Post profile/me
//  Desc  create or update profile
//  Access  Private

router.post(
  '/',
  [
    mid,
    [
      body('status', 'Status is Required').not().isEmpty(),
      body('skills', 'Skills is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // we use split which string into a array
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

//  Route  Post profile/me
//  get all profiles
//  Access  public
// routes to get all profiles

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    return res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

router.get('/user/user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res.status(400).json({ msg: 'there is no profile for this user' });
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectID') {
      return res.status(400).json({ msg: ' no profile for this user' });
    }
    res.status(500).send('Server Error');
  }
});
//  Route  DELETE profile/me
//  DELETE all profiles/POSTS/USER
//  Access  public
router.delete('/', mid, async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});
//  Route  put api/profile/experience
// add all profiles experience
//  Access  private
router.put(
  '/experience',
  [
    mid,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('location', 'Location is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
      body('to', 'To is required').not().isEmpty(),
      body('current', 'Current is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
    } catch (err) {
      console.log(err.message);
      res.status(400).send('Server Error');
    }
  }
);

module.exports = router;
