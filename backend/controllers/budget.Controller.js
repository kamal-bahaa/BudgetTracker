const Budget = require("../models/Budget.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");


exports.addBudget = asyncWrapper(async (req, res, next) => {
    const { month, categories } = req.body;
    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
    if (categories) {
        const categoryKeys = Object.keys(categories);
        const invalidKeys = categoryKeys.filter(key => !validCategories.includes(key));
        if (invalidKeys.length > 0) {
            return next(new AppError(`Invalid categories: ${invalidKeys.join(', ')}`, 400, JSend.FAIL));
        }
    }
    const exists = await Budget.findOne({ userId: req.user.id, month });

    if (exists) {
        return next(new AppError("Budget already exists for this month", 400, JSend.FAIL));
    }

    const budget = await Budget.create({
        userId: req.user.id,
        month,
        categories
    });

    res.status(201).json({
        status: JSend.SUCCESS,
        data: { budget }
    });
});


exports.getBudgets = asyncWrapper(async (req, res, next) => {
    const budgets = await Budget.find({ userId: req.user.id });

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { budgets }
    });
});


exports.updateBudget = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updateData = {};

    if (req.body.categories) {
        for (let key in req.body.categories) {
            updateData[`categories.${key}`] = req.body.categories[key];
        }
    }

    const updated = await Budget.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        updateData,
        { new: true }
    );

    if (!updated) {
        return next(new AppError("Budget not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { budget: updated }
    });
});


exports.deleteBudget = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Budget.findOneAndDelete({
        _id: id,
        userId: req.user.id
    });

    if (!deleted) {
        return next(new AppError("Budget not found or not yours", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { message: "Budget deleted" }
    });
});
