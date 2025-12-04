const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        targetAmount: {
            type: Number,
            required: true,
            min: 1
        },
        currentAmount: {
            type: Number,
            default: 0
        },
        deadline: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Goal", goalSchema);
