const express = require('express');
const router = express.Router();
const authControler = require('../controllers/auth');

router.post('/', authControler.handleLogin);

module.exports = router;