const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['volunteer', 'org'], required: true },
    skills: [String],
    bio: String,
    profilePicture: String,
    appliedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    createdMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
  },
  { timestamps: true }
);

// DO NOT use arrow function here
userSchema.pre('save', async function (next) {
  try {
    // If password not modified, move on
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
