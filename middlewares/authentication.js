import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.SECRETKEY;

const auth = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, key);
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token. Please login again." });
  }
};

export default auth;
