const Invite = require('../../models/invite');

const fetchInvite = async (req, res) => {
  try {
    const orgId = req.backUser.organization;

    const users = await Invite.find({ organization: orgId })
      .select('-organization -invitedBy') // exclude sensitive fields
      .populate({
        path: 'invitedBy',
        select: 'name email'
      });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching invites in organization:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = fetchInvite;
