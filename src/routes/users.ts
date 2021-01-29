import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import pool from "../dbConfig";
const router: Router = express.Router();

interface Errors {
  general?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  photoUrl?: string;
}

// Utilities
const isEmpty = (str: string): boolean => {
  if (str.trim() === "") return true;
  else return false;
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

// POST /api/users/register
// Register user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    const errors: Errors = {};

    // Email validation
    if (isEmail(email) === false) {
      errors.email = "E-mail must be correct";
    }
    if ((await isEmailAvailable(email)) === false) {
      errors.email = "This email is already assigned to another account";
    }

    // First name validation
    if (isEmpty(firstName)) {
      errors.firstName = "Must not be empty";
    }
    // Last name validation
    if (isEmpty(lastName)) {
      errors.lastName = "Must not be empty";
    }
    // Password validation
    if (isEmpty(password)) {
      errors.password = "Password must not be empty";
    }
    if (password.length < 8) {
      errors.password = "Password must conatin at least 8 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords must be the same";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const query = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, created_at, photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstName, lastName, email, hashedPassword, new Date(), null]
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

// POST /api/users/login
// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check email
    const query = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (query.rowCount === 0) {
      return res
        .status(400)
        .json({ errors: { general: "Wrong e-mail or password" } });
    }

    // Check password
    const user = query.rows[0];
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res
        .status(400)
        .json({ errors: { general: "Wrong e-mail or password" } });
    }

    // Create json web token
    if (!process.env.JWT_SECRET) return;
    const secret: Secret = process.env.JWT_SECRET.toString();
    const token = jwt.sign({ id: user.user_id }, secret);

    // Login user
    res.header("auth-token", token).status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// PUT /api/users/:userId
// Update user data
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      photoUrl,
    } = req.body;

    const queries = [];
    const errors: Errors = {};

    // console.log(typeof firstName, typeof lastName);

    // First Name
    if (firstName !== undefined) {
      if (isEmpty(firstName)) {
        errors.firstName = "Must not be empty";
      } else {
        const query = pool.query(
          "UPDATE users SET first_name=$1 WHERE user_id=$2 RETURNING *",
          [firstName, req.params.userId]
        );
        queries.push(query);
      }
    }

    // Last name
    if (lastName !== undefined) {
      if (isEmpty(lastName)) {
        errors.lastName = "Must not be empty";
      } else {
        const query = pool.query(
          "UPDATE users SET last_name=$1 WHERE user_id=$2 RETURNING *",
          [lastName, req.params.userId]
        );
        queries.push(query);
      }
    }

    // Email
    if (email !== undefined) {
      if (isEmpty(email)) {
        errors.email = "Must not be empty";
      } else if (isEmail(email) === false) {
        errors.email = "Email must be correct";
      } else if ((await isEmailAvailable(email)) === false) {
        errors.email = "This email is already assigned to another account";
      } else {
        const query = pool.query(
          "UPDATE users SET email=$1 WHERE user_id=$2 RETURNING *",
          [email, req.params.userId]
        );
        queries.push(query);
      }
    }

    // Password
    if (password !== undefined && confirmPassword !== undefined) {
      if (isEmpty(password)) {
        errors.password = "Must not be empty";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must be the same";
      } else if (password.length < 8) {
        errors.password = "Password must contain at least 8 characters";
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = pool.query(
          "UPDATE users SET password=$1 WHERE user_id=$2 RETURNING *",
          [hashedPassword, req.params.userId]
        );
        queries.push(query);
      }
    }

    // Photo url
    if (photoUrl !== undefined) {
      if (isEmpty(photoUrl)) {
        errors.photoUrl = "Must not be empty";
      } else {
        const query = pool.query(
          "UPDATE users SET photo_url=$1 WHERE user_id=$2 RETURNING *",
          [photoUrl, req.params.userId]
        );
        queries.push(query);
      }
    }

    // Check for errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Update user data
    const updatedData = await Promise.all(queries);
    const lastIndex = updatedData.length - 1;
    const updatedUser = updatedData[lastIndex].rows[0];

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// GET /api/users/:userId
// Get user data
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const query = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      req.params.userId,
    ]);
    if (query.rowCount === 0) {
      res.status(400).json({ errors: { general: "No user with given id" } });
    } else {
      const user = query.rows[0];
      res.status(200).json({ user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

export default router;
