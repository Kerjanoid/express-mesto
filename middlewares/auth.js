const jwt = require("jsonwebtoken");

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new Error("UnauthorizedError");
    err.statusCode = 401;
    next(err);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (e) {
    const err = new Error("ForbiddenError");
    err.statusCode = 403;
    next(err);
  }

  req.user = payload;

  return next();
};
