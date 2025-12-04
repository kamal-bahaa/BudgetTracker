const Goal = require("../models/Goal.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");


exports.addGoal = asyncWrapper(async (req, res, next) => {
    const { title, targetAmount, currentAmount, deadline } = req.body;

    const goal = await Goal.create({
        userId: req.user.id,
        title,
        targetAmount,
        currentAmount,
        deadline
    });

    res.status(201).json({
        status: JSend.SUCCESS,
        data: { goal }
    });
});


exports.getUserGoals = asyncWrapper(async (req, res, next) => {
    const goals = await Goal.find({ userId: req.user.id });

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { goals }
    });
});


exports.updateGoal = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updated = await Goal.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        req.body,
        { new: true }
    );

    if (!updated) {
        return next(new AppError("Goal not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { goal: updated }
    });
});


exports.deleteGoal = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Goal.findOneAndDelete({
        _id: id,
        userId: req.user.id
    });

    if (!deleted) {
        return next(new AppError("Goal not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { message: "Goal deleted" }
    });
});
