function notFound(req, res, next) {
  const error = new Error(`Page Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorMiddleware(err, req, res, next) {
  res.status(res.statusCode ?? 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
}

module.exports = { errorMiddleware, notFound };
