'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema(
    {

    email: { type: String, required: true, trim: true },
    
    password: { type: String, required: true, trim: true },
    
    salt: { type: String, required: true, trim: true },
    
    token: { type: String, required: false, trim: true },
    
    },
    {
        timestamps: true
    }    
);

module.exports = mongoose.model('User', UserSchema);