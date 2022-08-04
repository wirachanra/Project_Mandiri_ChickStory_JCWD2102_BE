const { verifyToken } = require("../lib/jwt");

const authorizedLoggedInUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);

    const verifiedToken = verifyToken(token);
    req.token = verifiedToken;

    console.log(req.token);

    next();
  } catch (err) {
    console.log(err);
    if (err.message === "jwt expired") {
      return res.status(419).json({
        message: "token expired",
      });
    }

    return res.status(401).json({
      message: err.message,
    });
  }
};

module.exports = { authorizedLoggedInUser };
