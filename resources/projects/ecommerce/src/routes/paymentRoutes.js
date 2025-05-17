const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Webhook endpoint
router.post(
  "/webhook",
  paymentController.webhook
);

module.exports = router;
