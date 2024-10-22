const express = require('express');
const { ensureAuthenticated, ensureUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureUser, (req, res) => {
    res.send('Welcome to the user dashboard');
});

module.exports = router;
