'use strict'

var express = require('express');
var CsvController = require('../controllers/csv');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: './csv' });

var router = express.Router();

router.post('/import-csv', multipartyMiddleware, CsvController.uploadCsv);
router.get('/download-csv', multipartyMiddleware, CsvController.downloadCsv);

module.exports = router;
