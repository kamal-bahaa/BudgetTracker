const mongoose = require("mongoose");
const Expense = require("../models/Expense.model");
const Income = require("../models/Income.model");
const Budget = require("../models/Budget.model");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");

exports.monthlySummary = asyncWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const monthStr = req.query.month; 

    if (!monthStr) {
        return next(new AppError("month query required e.g. ?month=2025-11", 400, JSend.FAIL));
    }

    const [year, month] = monthStr.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const expenseAgg = await Expense.aggregate([
        {
            $match: {
                userId: userObjectId,
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);

    const spentByCategory = {};
    let totalExpenses = 0;
    expenseAgg.forEach(item => {
        spentByCategory[item._id] = item.total;
        totalExpenses += item.total;
    });

    const incomeAgg = await Income.aggregate([
        { $match: { userId: userObjectId, date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalIncome = incomeAgg.length ? incomeAgg[0].total : 0;

    const budgetDoc = await Budget.findOne({ userId, month: monthStr }).lean();

    const categoriesSummary = [];

    const budgetCategories = budgetDoc ? budgetDoc.categories : {};
    const allCategories = new Set([
        ...Object.keys(spentByCategory),
        ...Object.keys(budgetCategories)
    ]);

    let totalBudgetLimit = 0;

    allCategories.forEach(cat => {
        const limit = budgetCategories[cat] || 0;
        const spent = spentByCategory[cat] || 0;

        totalBudgetLimit += limit;

        categoriesSummary.push({
            category: cat,
            limit,
            spent,
            remaining: Math.max(limit - spent, 0), 
            isOverBudget: spent > limit && limit > 0,
            usedPercent: limit > 0 ? Math.round((spent / limit) * 100) : (spent > 0 ? 100 : 0)
        });
    });

    const remainingBudgetGlobal = Math.max(totalBudgetLimit - totalExpenses, 0);

    res.status(200).json({
        status: JSend.SUCCESS,
        data: {
            month: monthStr,
            totalIncome,
            totalExpenses,
            totalBudget: totalBudgetLimit,
            remaining: remainingBudgetGlobal,
            balance: totalIncome - totalExpenses, 
            categories: categoriesSummary
        }
    });
});