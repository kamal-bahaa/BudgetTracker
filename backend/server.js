const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// DB
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth.Routes");
const expensesRoutes = require("./routes/expenses.Routes");
const incomeRoutes = require("./routes/income.routes");
const goalRoutes = require("./routes/goal.Routes");
const budgetRoutes = require("./routes/budget.Routes");
const summaryRoutes = require("./routes/summary.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const profileRoutes = require("./routes/profile.routes");

// Middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));


app.use('/api/auth', authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);


app.use(notFound);        // 404 handler
app.use(errorHandler);    // global error handler


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
