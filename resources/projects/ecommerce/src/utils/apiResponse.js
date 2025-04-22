const apiResponse = (res, status, success, data, message) => {
  return res.status(status).json({
    success,
    data,
    message
  });
};

module.exports = apiResponse;
