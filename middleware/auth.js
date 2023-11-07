import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  // eslint-disable-next-line no-undef
  jwt.verify(
    token,
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(404).json({ message: "Invalid token" });
      }

      req.body.userId = decoded.userId;
      return next();
    }
  );
};

export default authenticateUser;
