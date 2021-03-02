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
      "INSERT INTO messages (sender_id, recipient_id, message, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [senderId, recipientId, message, new Date()]
    );
    res.status(200).json(query.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

// GET /api/messages?senderId&recipientId
// Get messages
router.get("/", async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId } = req.query;

    if (!senderId || !recipientId) return;

    const query = await pool.query(
      "SELECT * FROM messages WHERE sender_id=$1 AND recipient_id=$2",
      [senderId, recipientId]
    );
    res.status(200).json(query.rows);
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

// GET /api/messages/:userId
// Get all messages which sender and recipient id match given user id
router.get("/:userId", verifyUser, async (req: Request, res: Response) => {
  try {
    const query = await pool.query(
      "SELECT messages.message_id, messages.sender_id, messages.recipient_id, messages.message, messages.created_at FROM users JOIN messages ON messages.recipient_id=$1 OR messages.sender_id=$1 GROUP BY message_id",
      [req.params.userId]
    );
    res.status(200).json(query.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, code: err.code });
  }
});

export default router;
