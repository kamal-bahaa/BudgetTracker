const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const goalController = require("../controllers/goal.Controller");   



// Create a new goal / Get all goals
router.route("/")
    .post(auth, goalController.addGoal)
    .get(auth, goalController.getUserGoals);

// Update / Delete specific goal
router.route("/:id")
    .patch(auth, goalController.updateGoal)
    .delete(auth, goalController.deleteGoal);


module.exports = router;
