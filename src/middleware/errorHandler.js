function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  if (!err.isOperational) {
    console.error('UNEXPECTED ERROR]:', err);
  }

  res.status(statusCode).json({ error: message });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}
module.exports = { errorHandler, notFoundHandler };