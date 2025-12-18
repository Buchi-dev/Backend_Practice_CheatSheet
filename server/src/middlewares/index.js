const auth = require('./auth.middleware');
const errorHandler = require('./errorHandler.middleware');
const logger = require('./loggers.middleware');
const limiter = require('./rateLimit.middleware');
const checkRole = require('./role.middleware');
const { validateUser, validateRegistration } = require('./validation.middleware');

module.exports = {
  auth,
  errorHandler,
  logger,
  limiter,
  checkRole,
  validateUser,
  validateRegistration,
};