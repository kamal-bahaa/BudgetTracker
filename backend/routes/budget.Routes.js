const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const budgetController = require("../controllers/budget.Controller");


// Create budget + Get all budgets
router.route("/")
    .post(auth, budgetController.addBudget)
    .get(auth, budgetController.getBudgets);

// Update + Delete specific budget
router.route("/:id")
    .patch(auth, budgetController.updateBudget)
    .delete(auth, budgetController.deleteBudget);

module.exports = router;
