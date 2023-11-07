import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const refreshToken = req.headers.authorization;

  // eslint-disable-next-line no-undef
  jwt.verify(
    refreshToken,
    // eslint-disable-next-line no-undef
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res
          .status(404)
          .json({ message: "Invalid token. Please log in again." });
      }

      req.body.userId = decoded.userId;
      return next();
    }
  );
};

export default authenticateToken;
