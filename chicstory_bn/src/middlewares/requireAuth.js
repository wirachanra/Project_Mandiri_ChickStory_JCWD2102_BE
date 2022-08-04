const requireAuth = (req, res, next) => {
  if (req.headers.cookie) {
    console.log("user logged in");
    return next();
  }
  return res.status(401).json({
    message: "user need to logged in to access the route",
  });
};

module.exports = requireAuth;
