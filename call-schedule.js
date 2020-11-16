'use strict'

var schedule = require('node-schedule');
var fs = require('fs');

var callSchedule = {

  schedule: function(file, date){ 

    var filePath = '/Users/Usuario/Desktop/var/spool/asterisk/outgoing/';
    
    schedule.scheduleJob(date, function(){

      fs.rename('./call/' + file, filePath + file, (error) => {
        
        if (error) throw error;
        console.log("Archivo copiado con éxito. " + "(" + date + ")");

      })
    });
  }
}

module.exports = callSchedule;