// jobs/taskExpiryJob.js
const cron = require('node-cron');
const Task = require('../models/Task');

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const result = await Task.updateMany(
      { dueDate: { $lt: now }, status: { $ne: 'Completed' } },
      { status: 'Expired' }
    );
    console.log(`${result.nModified} tasks marked as Expired.`);
  } catch (error) {
    console.error('Error updating tasks:', error);
  }
});
