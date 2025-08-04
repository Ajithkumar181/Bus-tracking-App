const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const SECRET_KEY = process.env.SECRET_KEY;

// Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "User already exists or server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.user_id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Get profile of logged-in user
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, name, email, role, created_at FROM users WHERE user_id = $1`,
      [req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve profile" });
  }
};

// Admin/staff: send notification to a user
exports.sendNotification = async (req, res) => {
  const { userId } = req.params;
  const { title, message } = req.body;

  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ error: "Only admin or staff can send notifications" });
  }

  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [userId, title, message]
    );
    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ error: "Notification failed" });
  }
};

// Get current user's notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY sent_at DESC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve notifications" });
  }
};
