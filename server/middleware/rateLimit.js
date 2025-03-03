const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts, please try again after 2 minutes'
});

const registerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 3, 
  message: 'Too many accounts created, please try again after 5 minutes'
});

module.exports = { loginLimiter, registerLimiter };