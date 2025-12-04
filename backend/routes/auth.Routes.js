const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.Controller");   
const { body } = require("express-validator");
const validator = require("../middlewares/validate");

router.post(
    "/register",
    [
        body("name")
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

        body("email")
            .isEmail().withMessage("Valid email required"),

        body("password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    validator,
    authController.register
);


router.post(
    "/login",
    [
        body("email")
            .isEmail().withMessage("Valid email required"),

        body("password")
            .notEmpty().withMessage("Password required")
    ],
    validator,
    authController.login
);

module.exports = router;
