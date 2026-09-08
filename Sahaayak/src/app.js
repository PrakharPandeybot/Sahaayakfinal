const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const workerRoutes = require("./routes/worker.routes");
const serviceRoutes = require("./routes/service.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const welfareRoutes = require("./routes/welfare.routes");
const schemeRoutes = require("./routes/scheme.routes");
const adminRoutes = require("./routes/admin.routes");
const reviewRoutes = require("./routes/review.routes");
const insuranceRoutes = require("./routes/insurance.routes");
const userRoutes = require("./routes/user.routes");
const notificationRoutes = require("./routes/notification.routes");
const workerSalaryRoutes = require("./routes/workerSalary.routes");
const trainingRoutes = require("./routes/training.routes");
const workerTrainingRoutes = require("./routes/workerTraining.routes");

const app = express();


// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sahaayak backend is running",
  });
});


// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/workers", workerRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/welfare", welfareRoutes);

app.use("/api/schemes", schemeRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/insurance", insuranceRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/worker-salaries", workerSalaryRoutes);

app.use("/api/training", trainingRoutes);

app.use("/api/worker-trainings", workerTrainingRoutes);


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("API ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


module.exports = app;