const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {type: String, required: true, trim: true},
    existencia: {type: Number, required: true, trim: true},
    precio: {type: Number, required: true, trim: true},
    creado: {type: Date, default: Date.now()},
});

ProductoSchema.index({nombre: 'text'});

module.exports = model('Producto', ProductoSchema);