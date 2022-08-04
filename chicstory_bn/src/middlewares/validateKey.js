const key = "abc";

const validateKey = (req, res, next) => {
  if (req.headers["x-secret-key"] === key) {
    console.log("user validated");
    next();
    return;
  }

  res.status(401).json({
    message: "user unauthorized",
  });
  return;
};
module.exports = validateKey;
