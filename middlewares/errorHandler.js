const handleDuplicateKeyError = (err, req, res, next) => {
  console.log("here");

  if (err.name === "MongoServerError" && err.code === 11000) {
    // Extract the field name from the error message (e.g., "name")
    const fieldName = err.keyPaa

    return res.status(400).json({
      status: false,
      error: {
        param: fieldName,
        message: `${fieldName} already exists.`,
        code: "RESOURCE_EXISTS",
      },
    });
  }

  // If it's not a duplicate key error, pass it to the next middleware
  next(err);
};

module.exports = {
  handleDuplicateKeyError,
};
