const User = require('../../models/user');

const fetchUsersInOrgController = async (req, res) => {
  try {
    const orgId = req.backUser.organization;

    const users = await User.find({ organization: orgId })
      .select('-password -refreshToken') // exclude sensitive fields
      .populate({
        path: 'invitedBy',
        select: 'name email'
      });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users in organization:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = fetchUsersInOrgController;
