'use strict'

var User = require('../models/user');
var csvtojson = require("csvtojson");
var fs = require('fs');
var jwt = require('jsonwebtoken');
var callSchedule = require('../call-schedule');

var privateKey = "da6587cc6c4320bfa20267416e2dcaf8fcb1553a5048a6c3f9a020ba0e447dd065620005fd55e4bbbf306db0ac5c0bb76abf15fd765d8c00c8946b20fa1d8ab9";

var controller = {

    uploadCsv: function(req, res){


        var token = req.headers.authorization;
        var tokenDecoded = jwt.verify(token, privateKey);

        User.findOne({email: tokenDecoded.email}).exec((error, user) =>{

            if(error) return res.status(401).send({message: "Acceso no autorizado."});

            if(user){

                var csvFile = req.files.file;
                var csvPath = csvFile.path;
                var splittedCsvPath = csvPath.split('\\');
                var retryTime = req.body.retryTime;

                function getCsvTemplate(clientNumber, umoNumber, retries){
                    return `Channel: Local/${clientNumber}​​​​​​​@ivr-autoDialing\nApplication: Dial\nData: Local/${umoNumber}​​​​​​​@agents\nMaxRetries: ${retries}​​​​​​​\nRetryTime: ${retryTime}\nSetvar: maxRetry=${retries}\nSetvar: retryTime=${retryTime}`;
                }

                setTimeout(function(){ 
                    fs.unlink('./csv/' + splittedCsvPath[1], (error) => {
                        if (error) throw error;
                        console.log("Archivo " + splittedCsvPath[1] +  " fue borrado satisfactoriamente.");
                    });
                }, 180000);

                csvtojson()
                    .fromFile('./csv/' + splittedCsvPath[1])
                    .then(csvData => {

                        for (var i = 0; i < csvData.length; i++) {

                            var clientNumber = csvData[i].numeroCliente;
                            var umoNumber = csvData[i].numeroUmo;
                            var retries = csvData[i].reintentos;

                            var csvTemplate = getCsvTemplate(clientNumber, umoNumber, retries);

                            fs.writeFile('./call/' + csvData[i].numeroCliente + '.call', csvTemplate, function (error) {
                                if (error) throw error;
                                console.log('Archivo creado con éxito.');
                            });

                            var startHour = csvData[i].horaInicio;
                            var splittedStartHour = startHour.split(':');
                            var today = new Date();
                            var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), splittedStartHour[0], splittedStartHour[1], splittedStartHour[2]);

                            callSchedule.schedule(csvData[i].numeroCliente + '.call', date);
                        }
                    }
                );
                return res.status(200).send({message: "Archivo importado con éxito."});
            }
        });
    },

    downloadCsv: function(req, res){

        var token = req.headers.authorization;
        var tokenDecoded = jwt.verify(token, privateKey);
        
        User.findOne({email: tokenDecoded.email}).exec((error, user) =>{
            console.log(user);

            if(error) return res.status(401).send({message: "Acceso no autorizado."});

            if(user){
                        
                var startPath = '/Users/Usuario/Desktop/etc/asterisk/perdidas/';
                var files = fs.readdirSync(startPath);
                var filePath = startPath + files[0];
                
                csvtojson()
                .fromFile(filePath)
                .on('error', (error) => {
                    if(error) return res.status(400).send({message: "Error al procesar el archivo."});
                })
                .then((data,)=>{          
                    if(data) return res.status(200).send(data);
                });
            }
        });
    }
}

module.exports = controller;