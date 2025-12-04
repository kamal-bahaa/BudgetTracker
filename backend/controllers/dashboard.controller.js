const mongoose = require("mongoose");
const Expense = require("../models/Expense.model");
const Income = require("../models/Income.model");
const Goal = require("../models/Goal.model");
const JSend = require("../utils/jsendStatus");
const asyncWrapper = require("../middlewares/asyncWrapper");

exports.overview = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // 0-11

    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [expensesAgg, incomeAgg] = await Promise.all([
        Expense.aggregate([
            { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]),
        Income.aggregate([
            { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ])
    ]);

    const goals = await Goal.find({ userId });
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

    const [recentExpenses, recentIncome] = await Promise.all([
        Expense.find({ userId }).sort({ date: -1 }).limit(5).lean(),
        Income.find({ userId }).sort({ date: -1 }).limit(5).lean()
    ]);

    const recentTransactions = [
        ...recentExpenses.map(e => ({ ...e, type: 'expense', description: e.title })),
        ...recentIncome.map(i => ({ ...i, type: 'income', description: i.title, category: i.source }))
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const totalExpenses = expensesAgg.length ? expensesAgg[0].total : 0;
    const totalIncome = incomeAgg.length ? incomeAgg[0].total : 0;

    res.status(200).json({
        status: JSend.SUCCESS,
        data: {
            overview: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                incomeCount: incomeAgg.length ? incomeAgg[0].count : 0,
                expenseCount: expensesAgg.length ? expensesAgg[0].count : 0,
                goalsCount: goals.length,
                completedGoals
            },
            recentTransactions
        }
    });
});