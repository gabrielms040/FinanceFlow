const express = require('express');
const router = express.Router();

const usersController = require('../Controllers/usersController');

router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.post('/refresh', usersController.refresh );

module.exports = router;
