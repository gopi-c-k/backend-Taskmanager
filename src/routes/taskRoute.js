// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task/taskController');
const authorize = require('../middlewares/roleMiddleWare');
const verify = require('../middlewares/authMiddleWare')

// Create Task
router.post('/tasks', verify, authorize(['Admin', 'Manager']), taskController.createTask);

// Get Tasks
router.get('/tasks', verify, authorize(['Admin', 'Manager', 'Member']), taskController.getTasks);

// Update Task
router.put('/tasks/:id', verify, authorize(['Admin', 'Manager']), taskController.updateTask);

// Delete Task
router.delete('/tasks/:id', verify, authorize(['Admin']), taskController.deleteTask);

module.exports = router;
