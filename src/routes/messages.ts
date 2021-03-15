import express, { Request, Response, Router } from "express";
import pool from "../config/dbConfig";
import verifyUser from "../middleware/verifyUser";
const router: Router = express.Router();

// POST /api/messages
// Create new message
router.post("/", async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, message } = req.body;
    const query = await pool.query(
      "INSERT INTO messages (sender_id, recipient_id, message, message_created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [senderId, recipientId, message, new Date()]
    );
    res.status(200).json(query.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// DELETE /api/messages/:messageId
// Delete message
router.delete("/:messageId", async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
      "DELETE FROM messages WHERE message_id=$1 RETURNING *",
      [req.params.messageId]
    );
    res.status(200).json(query.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// GET /api/users/messages/:userId
// Get all users which sender and recipient id match given user id
router.get("/:userId", verifyUser, async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
      "SELECT DISTINCT ON (messages.message_id) messages.message_id, messages.recipient_id, messages.sender_id, messages.message, messages.created_at, users.user_id, users.email, users.full_name, users.photo_url FROM messages JOIN users ON messages.sender_id=users.user_id WHERE messages.sender_id=$1 OR messages.recipient_id=$1 GROUP BY messages.message_id, users.user_id",
      [req.params.userId]
    );
    res.status(200).json(query.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

export default router;
