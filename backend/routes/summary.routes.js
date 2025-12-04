const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const summaryController = require("../controllers/summary.controller");


router.get("/overview", auth, summaryController.monthlySummary);

module.exports = router;
