'use strict'

var express = require('express');
var CsvController = require('../controllers/csv');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: './csv' });

var router = express.Router();

router.post('/csv', multipartyMiddleware, CsvController.uploadCsv);

module.exports = router;
