import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/dbConfig";
import verifyToken from "../middleware/verifyToken";
import verifyUser from "../middleware/verifyUser";
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
      return res.status(400).json(errors);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const fullName = `${firstName} ${lastName}`;
    const query = await pool.query(
      "INSERT INTO users (first_name, last_name, full_name, email, password, created_at, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstName, lastName, fullName, email, hashedPassword, new Date(), null]
    );
    const createdUser = query.rows[0];

    // Create json web token
    if (!process.env.JWT_SECRET) return;
    const secret = process.env.JWT_SECRET.toString();
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

    const loginError = {
      general: "Wrong e-mail or password",
    };

    // Check email
    const query = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (query.rowCount === 0) {
      return res.status(400).json(loginError);
    }

    // Check password
    const user = query.rows[0];
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res.status(400).json(loginError);
    }

    // Create json web token
    if (!process.env.JWT_SECRET) return;
    const secret = process.env.JWT_SECRET.toString();
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
router.put(
  "/:userId",
  verifyUser,
  verifyToken,
  async (req: Request, res: Response) => {
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
        return res.status(400).json(errors);
      }

      // Update user data
      const updatedData = await Promise.all(queries);
      const lastIndex = updatedData.length - 1;
      const updatedUser = updatedData[lastIndex].rows[0];

      res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message, code: err.code });
    }
  }
);

// GET /api/users/:userId
// Get user data
router.get(
  "/:userId",
  verifyUser,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const query = await pool.query("SELECT * FROM users WHERE user_id=$1", [
        req.params.userId,
      ]);
      const user = query.rows[0];
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message, code: err.code });
    }
  }
);

// DELETE /api/users/:userId
// Delete user
router.delete(
  "/:userId",
  verifyUser,
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const query = await pool.query(
        "DELETE FROM users WHERE user_id=$1 RETURNING *",
        [req.params.userId]
      );
      const deletedUser = query.rows[0];
      res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message, code: err.code });
    }
  }
);

// GET /api/users?fullName
// Get user with given full name
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
      "SELECT * FROM users WHERE full_name LIKE $1",
      [`%${req.query.fullName}%`]
    );
    res.status(200).json(query.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// GET /api/users/token/:userId
// Sign new json web token
router.get(
  "/token/:userId",
  verifyUser,
  async (req: Request, res: Response) => {
    try {
      // Get user data
      const query = await pool.query("SELECT * FROM users WHERE user_id=$1", [
        req.params.userId,
      ]);
      const user = query.rows[0];

      // Create json web token
      if (!process.env.JWT_SECRET) return;
      const secret = process.env.JWT_SECRET.toString();
      const token = jwt.sign({ id: user.user_id }, secret);

      // Login user
      res.header("auth-token", token).status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message, code: err.code });
    }
  }
);

export default router;
