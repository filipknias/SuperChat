import { Request, Response, NextFunction } from "express";
import pool from "../config/dbConfig";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      req.params.userId,
    ]);
    if (query.rowCount === 0) {
      return res.status(400).json({ error: "No user with given id" });
    } else {
      return next();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message, code: err.code });
  }
};
