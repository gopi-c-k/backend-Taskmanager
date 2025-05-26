const User = require('../../models/user');
const Invite = require('../../models/invite');
const Organization = require('../../models/organization');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const userCreation = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, token } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists in another organization" });
        }

        const invite = await Invite.findOne({ token });
        if (!invite) {
            return res.status(400).json({ message: "Invalid invite token" });
        }

        if (invite.status !== 'Pending' || invite.email !== email) {
            return res.status(400).json({ message: "Unauthorized or expired invite" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: invite.role,
            organization: invite.organization,
            invitedBy: invite.invitedBy || null,
        });


        const org = await Organization.findById(invite.organization);
        if (!org) {
            return res.status(500).json({ message: "Organization not found" });
        }

        await user.save();

        if (invite.role === 'Manager') {
            org.managers = org.managers || [];
            org.managers.push(user._id);
        } else {
            org.members = org.members || [];
            org.members.push(user._id);
        }

        await org.save();

        invite.status = 'Accepted';
        await invite.save();

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error('Error in userCreation:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

module.exports = { userCreation };
