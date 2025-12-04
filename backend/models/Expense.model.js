const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        category: {
            type: String,
            required: true,
            enum: ["Food", "Transport", "Shopping", "Bills", "Other"],
            default: "Other"
        },
        date: {
            type: Date,
            default: Date.now
        },
        isRecurring: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Expense", expenseSchema);