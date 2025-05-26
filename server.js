const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoute');
const taskRoutes = require('./src/routes/taskRoute');
const authRoutes = require('./src/routes/authRoute');

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send('API working Properly');
});

// Route
app.use("/user", userRoutes);
app.use("/auth",authRoutes);
app.use("/task",taskRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on available port ${process.env.PORT || 5000}`);
});
