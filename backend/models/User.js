const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['volunteer', 'org'], required: true },
    skills: [String], // For volunteers: ['React', 'UI Design', 'Video Editing']
    bio: String,
    profilePicture: String,
    appliedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    createdMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
