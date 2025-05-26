const express = require('express');
const { userCreation } = require('../controllers/onBoarding/signUp');
const { userSignIn } = require('../controllers/onBoarding/signIn');
const { organizationCreation } = require('../controllers/onBoarding/organizationRegister');
const { refreshUserToken } = require("../controllers/refreshUserToken");

const router = express.Router();

router.post('/register-organization', organizationCreation);
router.post('/signup', userCreation);

router.post('/signin', userSignIn);
router.post('/refresh-token', refreshUserToken);

module.exports = router;
