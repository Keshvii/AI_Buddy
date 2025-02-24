const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
require('dotenv').config();
const dbConnect = require("./config/dbConnect");

// Routes
const authRoutes = require("./routes/authRoutes");
const openaiRoutes = require("./routes/openaiRoutes");
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());  // ✅ Parse JSON requests
app.use(express.urlencoded({ extended: false })); // ✅ Parses form data
app.use(morgan('dev'));

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/openai", openaiRoutes);

// ✅ Move Error Middleware to the End
app.use(errorHandler);

// ✅ Start Server after DB Connection
dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server listening on port ${process.env.PORT || 8080}`.bgYellow);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB. Server not started.", error);
  });
