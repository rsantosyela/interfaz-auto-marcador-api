'use strict'

var User = require('../models/user');
var bcrypt = require('bcryptjs');

var controller = {

    createUser: function(req, res){
                
        var params = req.body;

        User.findOne({email: params.email}).exec((error, user) => {

            if(user) return res.status(409).send({message: "El usuario ya existe. Utilice otra dirección de email para registrarse."});

            if(error) return res.status(500).send({message: "Error al crear el nuevo usuario."});
            
            var user = new User();                
            var salt = bcrypt.genSaltSync();
            var hash = bcrypt.hashSync(params.password, salt);        

            user.email = params.email;
            user.password = hash;
            user.salt = salt;

            user.save((error, userStored) => {

                if(error) return res.status(500).send({message: "Error al crear el nuevo usuario."});
    
                if(!userStored) return res.status(404).send({message: "No se ha podido guardar el nuevo usuario."});
    
                return res.status(200).send({message: "Nuevo usuario registrado con éxito."});
            });
        }); 
    },

    deleteUser: function(req, res){

        var userId = req.params.id;

        User.findByIdAndRemove(userId, (error, userDeleted) => {

            if(error) return res.status(500).send({message: "Error al borrar el usuario."});

            if(!userDeleted) return res.status(404).send({message: "No se ha podido borrar al usuario."});

            return res.status(200).send({message: "Usuario eliminado con éxito."});
        });
    }
};

module.exports = controller;