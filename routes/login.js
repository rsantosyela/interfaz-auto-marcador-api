'use strict'

var express = require('express');
var LoginController = require('../controllers/login');

var router = express.Router();

router.post('/login', LoginController.userLogin);

module.exports = router;
