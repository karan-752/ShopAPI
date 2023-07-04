const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/user');
const checkAuth = require('../MiddleWare/check-auth');

router.post('/signUp', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;