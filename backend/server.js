// import express from 'express';
// import dotenv from 'dotenv';
// import adminRoutes from './src/routes/adminRoutes.js';
// import wasteRoutes from './src/routes/wasteRoutes.js';

// dotenv.config();
// const app = express();
// app.use(express.json());

// app.use('/api/admin', adminRoutes);
// app.use('/api/waste', wasteRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./src/routes/auth.js');
const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/user');
require('./src/config/passport');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(bodyParser.json()); 

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch(err => console.error(err));

