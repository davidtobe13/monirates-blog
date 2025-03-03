const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimit');


router.post('/register', registerLimiter, authController.registerUser);

router.post('/login', loginLimiter, authController.loginUser);

router.get('/user', auth, authController.getUserData);

module.exports = router;