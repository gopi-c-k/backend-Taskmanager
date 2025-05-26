// jobs/overdueNotificationJob.js
const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// Schedule the job to run every day at 1 AM
cron.schedule('0 1 * * *', async () => {
  try {
    const now = new Date();
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: 'Expired',
    }).populate('assignedTo');

    for (const task of overdueTasks) {
      const notification = new Notification({
        user: task.assignedTo._id,
        message: `Task "${task.title}" is overdue.`,
      });
      await notification.save();
    }
    console.log('Overdue notifications sent.');
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
});
