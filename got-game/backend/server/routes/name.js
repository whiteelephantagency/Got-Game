const express = require('express');
const router = express.Router();
const Name = require('../models/name');

// POST /api/names
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newName = new Name({ name });
    await newName.save();
    res.status(201).json({ message: 'Name saved successfully', name: newName });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
