const express = require('express');
const router = express.Router();
const inviteUser = require('../controllers/inviteuser');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post(
    '/invite',
    authMiddleware,
    roleMiddleware(['Admin', 'Manager']),
    inviteUser
);


module.exports = router;