const Expense = require("../models/Expense.model");
const Income = require("../models/Income.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const mongoose = require("mongoose");



exports.yearlyTrend = asyncWrapper(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const year = now.getUTCFullYear();

    const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));

    const expenses = await Expense.aggregate([
        {
            $match: {
                userId,
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: { date: "$date", timezone: "UTC" } }
                },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    const incomes = await Income.aggregate([
        {
            $match: {
                userId,
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: { date: "$date", timezone: "UTC" } }
                },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { year, expenses, incomes }
    });
});


exports.expenseByCategory = asyncWrapper(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Expense.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);

    res.status(200).json({
        status: JSend.SUCCESS,
        data
    });
});


exports.monthlySpending = asyncWrapper(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Expense.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: {
                    year: { $year: { date: "$date", timezone: "UTC" } },
                    month: { $month: { date: "$date", timezone: "UTC" } }
                },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
        status: JSend.SUCCESS,
        data
    });
});


exports.topCategories = asyncWrapper(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Expense.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        },
        { $sort: { total: -1 } },
        { $limit: 5 }
    ]);

    res.status(200).json({
        status: JSend.SUCCESS,
        data
    });
});


exports.biggestExpense = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;

    const expense = await Expense.findOne({ userId })
        .sort({ amount: -1 })
        .limit(1);

    res.status(200).json({
        status: JSend.SUCCESS,
        data: expense || null
    });
});


exports.incomeBySource = asyncWrapper(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Income.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: "$source",
                total: { $sum: "$amount" }
            }
        }
    ]);

    res.status(200).json({
        status: JSend.SUCCESS,
        data
    });
});