// controllers/taskController.js
const Task = require('../../models/task');
const User = require('../../models/user');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, assignedToId } = req.body;

    if (!title || !assignedToId) {
      return res.status(400).json({ message: "Title and Assigned User are required" });
    }

    const assignedUser = await User.findById(assignedToId);
    if (!assignedUser) {
      return res.status(400).json({ message: "Invalid assigned user ID" });
    }

    if (!req.backUser || !req.backUser.organization) {
      return res.status(403).json({ message: "Unauthorized: Missing organization info" });
    }

    // Create task
    const task = new Task({
      title,
      description,
      category,
      priority,
      dueDate,
      assignedTo: assignedUser._id, // Save only the user ID
      organization: req.backUser.organization,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ organization: req.backUser.organization })
      .populate('assignedTo', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.backUser,
      organization: req.backUser.organization,
    }).populate('assignedTo', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTask:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, organization: req.backUser.organization },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateTaskByMember = async (req, res) => {
  const taskId = req.params.id;
  const { status, comment } = req.body;
  const userId = req.backUser?._id; 
  const userOrg = req.backUser?.organization;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: You are not assigned to this task" });
    }

    if (task.organization.toString() !== userOrg.toString()) {
      return res.status(403).json({ message: "Forbidden: Organization mismatch" });
    }

    // Update task status and comment
    task.status = status;
    if (comment !== undefined) {
      task.comments = comment;
    }

    await task.save();

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task by member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, organization: req.backUser.organization });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
