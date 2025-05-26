const Task = require('../../models/task');

const getTaskStatsForOrganization = async (req, res) => {
  try {
    const orgId = req.backUser.organization;

    const now = new Date();

    const totalTasks = await Task.countDocuments({ organization: orgId });

    const overdueTasks = await Task.countDocuments({
      organization: orgId,
      dueDate: { $lt: now },
      status: { $ne: 'Completed' },
    });

    const completedTasks = await Task.countDocuments({
      organization: orgId,
      status: 'Completed',
    });

    const categoryAggregation = await Task.aggregate([
      { $match: { organization: orgId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const tasksByCategory = {
      Bug: 0,
      Feature: 0,
      Improvement: 0
    };

    categoryAggregation.forEach(cat => {
      tasksByCategory[cat._id] = cat.count;
    });

    res.status(200).json({
      totalTasks,
      overdueTasks,
      completedTasks,
      tasksByCategory
    });
  } catch (err) {
    console.error('Error fetching task stats:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = getTaskStatsForOrganization;
