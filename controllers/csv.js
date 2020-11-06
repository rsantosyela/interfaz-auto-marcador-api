'use strict'

var csvtojson = require("csvtojson");
var fs = require('fs');
var dot = require('dot');
//var fastcsv = require("fast-csv");

var controller = {

    uploadCsv: function(req, res){

        var csvFile = req.files.file;
        var csvPath = csvFile.path;
        var splittedCsvPath = csvPath.split('\\');
    
        function getCsvTemplate(clientNumber, umoNumber, retries){
            return `Channel: Local/${clientNumber}​​​​​​​@ivr-autoDialing\nApplication: Dial\nData: Local/${umoNumber}​​​​​​​@agents\nMaxRetries: ${retries}​​​​​​​\nRetryTime: 600\nSetvar: maxRetry=${retries}\nSetvar: retryTime=600`;
        }

        csvtojson()
            .fromFile('./csv/' + splittedCsvPath[1])
            .then(csvData => {

                for (var i = 0; i < csvData.length; i++) {
              
                    var clientNumber = csvData[i].numeroCliente;
                    var umoNumber = csvData[i].numeroUmo;
                    var retries = csvData[i].retries;
                    
                    var csvTemplate = getCsvTemplate(clientNumber, umoNumber, retries);

                    fs.appendFile('./call/' + csvData[i].numeroCliente + '.call', csvTemplate, function (error) {
                        if (error) throw error;
                        console.log('Saved!');
                    });
                }    
            }
        );

        //fs.writeFile('users.json', JSON.stringify(users, null, 4), (err) => {
            //if (err) {
                //throw err;
            //}
            //console.log("JSON array is saved.");
        //});

        //console.log(csvData);

        // fs.appendFile('./call/mynewfile1.call', csvTemplateText, function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        // });




        //var parsedCsv = JSON.parse(csvDataJson);
        //var csvDataJson = csvtojson().fromFile('./csv/' + splittedCsvPath[1]);
        //console.log(csvDataJson);
        //console.log(data);

        return res.status(200).send({message: "Haciendo pruebas."});
      
    },




}

module.exports = controller;