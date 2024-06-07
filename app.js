const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');

// Load enironment variables
dotenv.config();

// Initializing the app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}) 
.then (() => {
    console.log(`\t\t---------MongoDB Connected!---------`);
})
.catch(err => console.log(err));

// Passport config 
require('./config/passport')(passport);

// Routes
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n--------------------Server running on port ${PORT}---------------------------\n`);
})