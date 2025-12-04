const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const expensesController = require("../controllers/expenses.Controller");    


router.route("/")
    .post(auth, expensesController.addExpense)
    .get(auth, expensesController.getUserExpenses);

router.route("/:id")
    .patch(auth, expensesController.updateExpense)
    .delete(auth, expensesController.deleteExpense);


module.exports = router;
