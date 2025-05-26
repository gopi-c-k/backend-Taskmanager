const express = require('express');
const router = express.Router();
const inviteUser = require('../controllers/inviteuser');
const fetchUsers = require('../controllers/user/fetchUserController')
const fetchInvites = require('../controllers/user/fetchInviteController')
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post(
    '/invite',
    authMiddleware,
    roleMiddleware(['Admin', 'Manager']),
    inviteUser
);
router.get('/fetch',authMiddleware,roleMiddleware(['Admin']),fetchUsers);
router.get('/invite',authMiddleware,roleMiddleware(['Admin']),fetchInvites);

module.exports = router;