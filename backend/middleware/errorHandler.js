/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.keys(err.errors).map((key) => ({
        field: key,
        message: err.errors[key].message,
      })),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Generic error
  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

/**
 * Async handler to wrap route handlers and catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
