const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes'
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3, 
  message: 'Too many accounts created, please try again after an hour'
});

module.exports = { loginLimiter, registerLimiter };