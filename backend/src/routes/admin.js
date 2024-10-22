const express = require('express');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.send('Welcome to the admin dashboard');
});

module.exports = router;
