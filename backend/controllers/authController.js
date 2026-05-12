/**
 * Auth Controller
 * Handles registration, login, and logout logic.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDB } = require('../config/db');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = await initDB();

    if (db.data.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword, name };
    
    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await initDB();
    const user = db.data.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };
