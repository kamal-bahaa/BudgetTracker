const Income = require("../models/Income.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");


exports.addIncome = asyncWrapper(async (req, res, next) => {
    const { title, amount, source, date } = req.body;

    const income = await Income.create({
        userId: req.user.id,
        title,
        amount,
        source,
        date
    });

    res.status(201).json({
        status: JSend.SUCCESS,
        data: { income }
    });
});


exports.getUserIncome = asyncWrapper(async (req, res, next) => {
    const incomeList = await Income.find({ userId: req.user.id });

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { income: incomeList }
    });
});


exports.updateIncome = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updated = await Income.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        req.body,
        { new: true }
    );

    if (!updated) {
        return next(new AppError("Income not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { income: updated }
    });
});


exports.deleteIncome = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Income.findOneAndDelete({
        _id: id,
        userId: req.user.id
    });

    if (!deleted) {
        return next(new AppError("Income not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { message: "Income deleted" }
    });
});
