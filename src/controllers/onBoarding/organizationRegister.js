const User = require('../../models/user');
const Organization = require('../../models/organization');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const organizationCreation = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'Admin'
      // organization will be added after org is created
    });

    const organization = new Organization({
      name: organizationName,
      admin: user._id
    });

    await organization.save();

    user.organization = organization._id;
    await user.save();

    organization.managers = [user._id];
    await organization.save();

    res.status(201).json({ message: "Organization and admin created successfully" });

  } catch (error) {
    console.error('Error in organizationCreation:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = { organizationCreation };
