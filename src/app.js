const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi=require("swagger-ui-express");
const swaggerDocument=require("./swagger");
const authRoutes=require("./routes/authRoutes");
const recordRoutes=require("./routes/recordRoutes");
const dashboardRoutes=require("./routes/dashboardRoutes");
const userRoutes=require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth",authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({ message: "Finance Dashboard Backend API is running" });
});

module.exports = app;