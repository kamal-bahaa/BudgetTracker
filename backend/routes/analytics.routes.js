const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const analyticsController = require("../controllers/analytics.controller");


// Get yearly income & expense trend
router.get("/yearly-trend", auth, analyticsController.yearlyTrend);

// Get expenses grouped by category (Pie chart)
router.get("/expense-category", auth, analyticsController.expenseByCategory);

// Get monthly spending trend
router.get("/monthly-spending", auth, analyticsController.monthlySpending);

// Get top 5 categories with highest spending
router.get("/top-categories", auth, analyticsController.topCategories);

// Get user's biggest expense
router.get("/biggest-expense", auth, analyticsController.biggestExpense);

// Get income grouped by source
router.get("/income-source", auth, analyticsController.incomeBySource);

module.exports = router;
