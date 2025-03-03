require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const cors = require("cors");

const app = express();

app.use(cors())


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const { renderHomePage } = require('./controllers/viewController');
app.get('/', renderHomePage);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
