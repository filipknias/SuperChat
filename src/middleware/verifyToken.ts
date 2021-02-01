import { Response, NextFunction } from "express";
import { AuthRequest } from "../config/types";
import jwt from "jsonwebtoken";

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    if (!process.env.JWT_SECRET) return;
    const secret = process.env.JWT_SECRET.toString();
    const verified = jwt.verify(token, secret);
    req.user = verified.toString();
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};
