import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import pool from "../dbConfig";
const router: Router = express.Router();

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Utilities
const isEmpty = (str: string): boolean => {
  if (str.trim() === "") return true;
  else return false;
};

const passwordCorrect = (password: string): boolean => {
  if (password.length < 8) return false;
  else return true;
};

const isEmail = (email: string): boolean => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmailAvailable = async (email: string): Promise<boolean> => {
  const query = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (query.rowCount === 0) return true;
  else return false;
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    const errors: Errors = {};

    if (isEmail(email) === false) {
      errors.email = "E-mail must be correct";
    }
    if ((await isEmailAvailable(email)) === false) {
      errors.email = "This email is already assigned to another account";
    }
    if (isEmpty(firstName)) {
      errors.firstName = "Must not be empty";
    }
    if (isEmpty(lastName)) {
      errors.lastName = "Must not be empty";
    }
    if (isEmpty(password)) {
      errors.password = "Password must not be empty";
    }
    if (passwordCorrect(password) === false) {
      errors.password = "Password must conatin at least 8 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords must be the same";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const query = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstName, lastName, email, hashedPassword, new Date()]
    );
    const createdUser = query.rows[0];

    // Create json web token
    if (!process.env.JWT_SECRET) return;
    const secret: Secret = process.env.JWT_SECRET.toString();
    const token = jwt.sign({ id: createdUser.user_id }, secret);

    res.status(200).json({ token, user: createdUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

export default router;
