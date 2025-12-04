const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const incomeController = require("../controllers/income.Controller");   



// Add income + Get all income records
router.route("/")
    .post(auth, incomeController.addIncome)
    .get(auth, incomeController.getUserIncome);

// Update & Delete income by ID
router.route("/:id")
    .patch(auth, incomeController.updateIncome)
    .delete(auth, incomeController.deleteIncome);


module.exports = router;
