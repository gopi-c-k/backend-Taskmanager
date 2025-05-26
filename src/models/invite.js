const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    role: { type: String, enum: ['Manager', 'Member'], required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Accepted'], default: 'Pending' },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Invite', inviteSchema);
