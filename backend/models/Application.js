const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    portfolio: String, // Link to volunteer's GitHub/portfolio
    message: String, // Volunteer's message to org
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
