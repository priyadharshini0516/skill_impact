const express = require('express');
const Application = require('../models/Application');
const Mission = require('../models/Mission');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all applications for a user
router.get('/my-applications', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ volunteerId: req.userId })
      .populate('missionId')
      .populate('volunteerId', 'name email skills');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for a mission
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { missionId, portfolio, message } = req.body;

    // Check if already applied
    const existing = await Application.findOne({
      volunteerId: req.userId,
      missionId,
    });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this mission' });
    }

    const application = new Application({
      volunteerId: req.userId,
      missionId,
      portfolio,
      message,
    });

    await application.save();

    // Add to mission's applicants array
    await Mission.findByIdAndUpdate(missionId, {
      $push: { applicants: application._id },
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a mission (org only)
router.get('/mission/:missionId', authMiddleware, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId);

    // Check if user is the mission creator
    if (mission.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const applications = await Application.find({ missionId: req.params.missionId })
      .populate('volunteerId', 'name email skills bio')
      .populate('missionId');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept application
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const mission = await Mission.findById(application.missionId);

    // Check if user is mission creator
    if (mission.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = 'accepted';
    await application.save();

    // Assign mission to volunteer
    await Mission.findByIdAndUpdate(mission._id, {
      assignedTo: application.volunteerId,
      status: 'in-progress',
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark application as completed
router.put('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    // Check if user is the volunteer
    if (application.volunteerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = 'completed';
    await application.save();

    // Update mission status
    const mission = await Mission.findById(application.missionId);
    mission.status = 'completed';
    await mission.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject application
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const mission = await Mission.findById(application.missionId);

    // Check if user is mission creator
    if (mission.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
