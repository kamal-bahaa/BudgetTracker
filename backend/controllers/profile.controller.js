const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");


exports.getProfile = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password -__v");

    if (!user) {
        return next(new AppError("User not found", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { user }
    });
});


exports.updateProfile = asyncWrapper(async (req, res, next) => {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    if (req.body.password) {
        updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
        return next(new AppError("User not found", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { user: updatedUser }
    });
});


exports.deleteProfile = asyncWrapper(async (req, res, next) => {
    const deleted = await User.findByIdAndDelete(req.user.id);

    if (!deleted) {
        return next(new AppError("User not found", 404, JSend.FAIL));
    }

    res.status(200).json({
        status: JSend.SUCCESS,
        data: { message: "Account deleted successfully" }
    });
});
