const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/overview", auth, dashboardController.overview);

module.exports = router;
