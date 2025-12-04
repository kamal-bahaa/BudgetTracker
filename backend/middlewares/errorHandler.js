const JSend = require("../utils/jsendStatus");

module.exports = (err, req, res, next) => {
    console.error("🔥 ERROR:", err);

    const statusCode = err.statusCode || 500;
    const status = err.status || JSend.ERROR;

    res.status(statusCode).json({
        status,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};
