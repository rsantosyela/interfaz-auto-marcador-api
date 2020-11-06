'use strict'

var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var privateKey = "da6587cc6c4320bfa20267416e2dcaf8fcb1553a5048a6c3f9a020ba0e447dd065620005fd55e4bbbf306db0ac5c0bb76abf15fd765d8c00c8946b20fa1d8ab9";

var controller = {

    userLogin: function(req, res){

        var userEmail = req.body.email;
        var userPassword = req.body.password;

        User.findOne({email: userEmail}).exec((error, user) => {

            if(error) return res.status(500).send({message: "Error al logear en el sistema."});

            if(!user) return res.status(404).send({message: "No se pudo encontrar el usuario."});

            bcrypt.compare(userPassword, user.password, function(error, check) {

                if(error) return res.status(500).send({message: "Error al logear en el sistema."})

                if(check){

                    var token = jwt.sign({ email: user.email }, privateKey);
                    user.token = token;

                    return res.status(200).send({message: "Usuario logeado con éxito"});

                }else{

                    return res.status(401).send({message: "Email o contraseña incorrectos."});
                }
            });  
        });
    },
}

module.exports = controller;