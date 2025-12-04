const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: "Invalid email format",
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("User", userSchema);
