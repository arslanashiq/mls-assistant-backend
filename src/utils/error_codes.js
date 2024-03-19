module.exports.WRONG_HTTP_METHOD = (req, res) => {
  res.status(405).json({
    code: 405,
    message: "Http Method not allowed",
  });
};
