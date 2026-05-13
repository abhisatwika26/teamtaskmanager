const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User'); // Need User model to fetch assignees
const router = express.Router();

// Get tasks based on role
router.get('/', auth, async (req, res) => {
  try {
    const tasks = req.user.role === 'Admin' 
      ? await Task.find().populate('assignedTo', 'name email') 
      : await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin: Create a new task
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, projectId } = req.body;
    const newTask = new Task({
      title, description, dueDate, priority, assignedTo, projectId
    });
    const task = await newTask.save();
    res.json(await task.populate('assignedTo', 'name email'));
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Both: Update task status
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Ensure Members can only update their own tasks
    if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.status = req.body.status || task.status;
    await task.save();
    res.json(await task.populate('assignedTo', 'name email'));
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin: Get all users to populate the "Assign To" dropdown
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'Member' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;