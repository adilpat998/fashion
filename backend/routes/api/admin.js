const express = require('express');
const router = express.Router();

// Simple in-memory session (for demo; use JWT or proper session in production)
let adminSession = null;

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { passkey } = req.body;
  if (!passkey) return res.status(400).json({ error: 'Passkey required' });
  if (passkey === process.env.ADMIN_PASSKEY) {
    // Generate a simple session token (for demo)
    adminSession = Date.now() + '-' + Math.random();
    res.json({ token: adminSession });
  } else {
    res.status(401).json({ error: 'Invalid passkey' });
  }
});

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && token === adminSession) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Example protected route
router.get('/check', requireAdmin, (req, res) => {
  res.json({ ok: true });
});


module.exports = router;
module.exports.requireAdmin = requireAdmin;
