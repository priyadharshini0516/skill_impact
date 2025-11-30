const express = require('express');
const Mission = require('../models/Mission');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all missions
router.get('/', async (req, res) => {
  try {
    const missions = await Mission.find().populate('createdBy', 'name');
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create mission (org only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, skillsRequired, timeCommitment, deadline, impact } = req.body;
    const mission = new Mission({
      title,
      description,
      skillsRequired,
      timeCommitment,
      deadline,
      impact,
      createdBy: req.userId,
    });
    await mission.save();
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mission by ID
router.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('createdBy', 'name email bio')
      .populate({
        path: 'applicants',
        populate: { path: 'volunteerId', select: 'name email skills' },
      });
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's created missions
router.get('/user/missions', authMiddleware, async (req, res) => {
  try {
    const missions = await Mission.find({ createdBy: req.userId })
      .populate('applicants')
      .populate('assignedTo', 'name email');
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mission
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (mission.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('createdBy', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mission
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (mission.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Mission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
