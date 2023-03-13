const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema({
    name: {type: String, required: true},
    adresse: {type: String, required: true},
    phone: {type: String, required: true},
    email:{type: String, required: true},
    date:{type: Date, required: true},

});

module.exports = mongoose.model('Registration',registrationSchema );