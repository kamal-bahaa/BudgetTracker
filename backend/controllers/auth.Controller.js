const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const JSend = require("../utils/jsendStatus");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const generateJWT = require("../utils/generate.JWT");


exports.register = asyncWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("Email already registered", 400, JSend.FAIL));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        status: JSend.SUCCESS,
        data: {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        },
    });
});


exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid email or password", 400, JSend.FAIL));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError("Invalid email or password", 400, JSend.FAIL));
    }

    const token = generateJWT({ id: user._id });

    res.status(200).json({
        status: JSend.SUCCESS,
        data: {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
});
