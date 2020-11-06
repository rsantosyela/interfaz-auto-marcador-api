'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.post('/user', UserController.createUser);
router.delete('/user/:id', UserController.deleteUser);

module.exports = router;