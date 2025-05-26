const Invite = require('../models/invite');
const User = require('../models/user');
const Organization = require('../models/organization');

const generateUniqueNumericToken = async () => {
  let token;
  let exists = true;

  while (exists) {
    token = Math.floor(100000 + Math.random() * 900000).toString();
    const invite = await Invite.findOne({ token });
    if (!invite) exists = false;
  }

  return token;
};

const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!['Manager', 'Member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const inviter = req.backUser; // from auth middleware
    const organizationId = inviter.organization;

    // Check if email already exists in the same org
    const existingUser = await User.findOne({ email, organization: organizationId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists in your organization' });
    }

    const token = await generateUniqueNumericToken();

    const invite = new Invite({
      email,
      role,
      token,
      organization: organizationId,
      invitedBy: inviter._id,
    });

    await invite.save();

    res.status(201).json({
      message: 'Invitation sent successfully',
      inviteCode: token,
      email,
      role,
    });
  } catch (err) {
    console.error('Error inviting user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = inviteUser;
