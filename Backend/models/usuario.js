const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {type: String, required: true, trim: true},
    apellido: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, trim: true},
    creado: {type: Date, default: Date.now()},
});

module.exports = model('Usuario', UsuarioSchema);