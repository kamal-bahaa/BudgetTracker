const jwt = require("jsonwebtoken");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Access denied. No token provided.", 401, JSend.FAIL));
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return next(new AppError("User no longer exists", 401, JSend.FAIL));

        req.user = user;

        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401, JSend.ERROR));
    }
};

module.exports = authMiddleware;
