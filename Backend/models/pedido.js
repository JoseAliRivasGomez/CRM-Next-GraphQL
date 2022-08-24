const {Schema, model} = require('mongoose');

const PedidoSchema = Schema({
    pedido: {type: Array, required: true},
    total: {type: Number, required: true, trim: true},
    cliente: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true, trim: true},
    vendedor: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true, trim: true},
    estado: {type: String, trim: true, default: "PENDIENTE"},
    creado: {type: Date, default: Date.now()},
});

module.exports = model('Pedido', PedidoSchema);