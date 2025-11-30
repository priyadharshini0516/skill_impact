const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [String], // ['React', 'UI Design']
    timeCommitment: String, // '5 hours', '1 week'
    status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    impact: String, // 'Design a website for our NGO', 'Create promotional videos'
    deadline: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
