const Expense = require("../models/Expense.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");


exports.addExpense = asyncWrapper(async (req, res, next) => {
    const { title, amount, category, date, isRecurring } = req.body;

    const newExpense = await Expense.create({
        userId: req.user.id,
        title,
        amount,
        category,
        date: date || Date.now(),
        isRecurring: isRecurring || false 
    });

    res.status(201).json({
        status: JSend.SUCCESS,
        data: { expense: newExpense }
    });
});

exports.getUserExpenses = asyncWrapper(async (req, res, next) => {
    const expenses = await Expense.find({ userId: req.user.id });

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { expenses }
    });
});


exports.deleteExpense = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({
        _id: id,
        userId: req.user.id
    });

    if (!deleted) {
        return next(new AppError("Expense not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { message: "Expense deleted" }
    });
});


exports.updateExpense = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updated = await Expense.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        req.body,
        { new: true }
    );

    if (!updated) {
        return next(new AppError("Expense not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { expense: updated }
    });
});
