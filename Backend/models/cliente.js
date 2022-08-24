const {Schema, model} = require('mongoose');

const ClienteSchema = Schema({
    nombre: {type: String, required: true, trim: true},
    apellido: {type: String, required: true, trim: true},
    empresa: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true},
    telefono: {type: String, trim: true},
    creado: {type: Date, default: Date.now()},
    vendedor: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true, trim: true},
});

module.exports = model('Cliente', ClienteSchema);