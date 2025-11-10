const express = require("express");
const router = express.Router();
const {
  verifyTransport,
  sendGenericEmail,
} = require("../../services/common/MailService");

// GET /api/debug/mail/verify -> verifica conexión SMTP (AUTH, host, puerto)
router.get("/mail/verify", async (req, res) => {
  try {
    const info = await verifyTransport();
    return res.status(info.verified ? 200 : 400).json(info);
  } catch (err) {
    console.error("[DebugMail] verify error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/debug/mail/test { to, subject?, text?, html? }
router.post("/mail/test", async (req, res) => {
  const { to, subject, text, html, from } = req.body || {};
  if (!to) {
    return res.status(400).json({ error: "El campo 'to' es requerido" });
  }
  try {
    const info = await sendGenericEmail({ to, subject, text, html, from });
    return res.status(200).json({ success: true, info });
  } catch (err) {
    console.error("[DebugMail] send error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;