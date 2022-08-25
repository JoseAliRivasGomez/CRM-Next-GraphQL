const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Cliente = require('../models/cliente');
const Pedido = require('../models/pedido');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const crearToken = (usuario, expiresIn) => {
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign({id, nombre, apellido, email}, process.env.JWT_KEY, {expiresIn});
}

const resolvers = {
    Query: {
        obtenerUsuario: async (_, {}, ctx, info) => {
            // const usuario = await jwt.verify(token, process.env.JWT_KEY);
            // console.log(usuario);
            // return usuario;
            return ctx.usuario;
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, {id}, ctx, info) => {
            const producto = await Producto.findById(id);
            if(!producto){
                throw new Error('Producto no encontrado');
            }
            return producto;
        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async (_, {}, ctx, info) => {
            try {
                const clientes = await Cliente.find({vendedor: ctx.usuario?.id.toString()});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente: async (_, {id}, ctx, info) => {
            const cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error('Cliente no encontrado');
            }
            if(cliente.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese cliente');
            }
            return cliente;
        },
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor: async (_, {}, ctx, info) => {
            try {
                const pedidos = await Pedido.find({vendedor: ctx.usuario?.id.toString()});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async (_, {id}, ctx, info) => {
            const pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error('Pedido no encontrado');
            }
            if(pedido.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese pedido');
            }
            return pedido;
        },
        obtenerPedidosEstado: async (_, {estado}, ctx, info) => {
            try {
                const pedidos = await Pedido.find({vendedor: ctx.usuario?.id, estado});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                {$match: {estado: "COMPLETADO"}},
                {$group: {
                    _id: "$cliente",
                    total: {$sum: "$total"}
                }},
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                },
                {
                    $limit: 5
                },
                {
                    $sort: {total: -1}
                }
            ]);
            return clientes;
        },
        mejoresVendedores: async () => {
            const vendedores = await Pedido.aggregate([
                {$match: {estado: "COMPLETADO"}},
                {$group: {
                    _id: "$vendedor",
                    total: {$sum: "$total"}
                }},
                {
                    $lookup: {
                        from: 'usuarios',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'vendedor'
                    }
                },
                {
                    $limit: 5
                },
                {
                    $sort: {total: -1}
                }
            ]);
            return vendedores;
        },
        buscarProducto: async (_, {texto}, ctx, info) => {
            const productos = await Producto.find({$text: {$search: texto}}).limit(10);
            return productos;
        }
    },
    Mutation: {
        nuevoUsuario: async (_, {input}, ctx, info) => {
            const {email, password} = input;

            const existeUsuario = await Usuario.findOne({email});
            
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado')
            }

            const salt = await bcryptjs.genSalt();
            input.password = await bcryptjs.hash(password, salt);

            try {
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        autenticarUsuario: async (_, {input}, ctx, info) => {
            const {email, password} = input;

            const existeUsuario = await Usuario.findOne({email});
            
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            const passwordCorrecto = bcryptjs.compareSync(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error('El password es incorrecto');
            }

            return {
                token: crearToken(existeUsuario, '24h')
            }

        },
        nuevoProducto: async (_, {input}, ctx, info) => {
            try {
                const producto = new Producto(input);
                const resultado = await producto.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarProducto: async (_, {id, input}, ctx, info) => {
            let producto = await Producto.findById(id);
            if(!producto){
                throw new Error('Producto no encontrado');
            }
            producto = await Producto.findOneAndUpdate({_id: id}, input, {new:true});
            return producto;
        },
        eliminarProducto: async (_, {id}, ctx, info) => {
            let producto = await Producto.findById(id);
            if(!producto){
                throw new Error('Producto no encontrado');
            }
            await Producto.findOneAndDelete({_id: id});
            return "Producto eliminado";
        },
        nuevoCliente: async (_, {input}, ctx, info) => {
            const {email} = input;

            const cliente = await Cliente.findOne({email});
            
            if(cliente){
                throw new Error('El cliente ya esta registrado')
            }

            const nuevoCliente = new Cliente(input);
            nuevoCliente.vendedor = ctx.usuario.id;

            try {
                const resultado = await nuevoCliente.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarCliente: async (_, {id, input}, ctx, info) => {
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error('Cliente no encontrado');
            }
            if(cliente.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese cliente');
            }
            cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new:true});
            return cliente;
        },
        eliminarCliente: async (_, {id}, ctx, info) => {
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error('Cliente no encontrado');
            }
            if(cliente.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese cliente');
            }
            await Cliente.findOneAndDelete({_id: id});
            return "Cliente eliminado";
        },
        nuevoPedido: async (_, {input}, ctx, info) => {
            const {cliente} = input;

            const clienteDB = await Cliente.findById(cliente);
            
            if(!clienteDB){
                throw new Error('El cliente no existe')
            }

            if(clienteDB.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese cliente');
            }

            for await (const articulo of input.pedido) {
                const {id} = articulo;
                const producto = await Producto.findById(id);
                if(articulo.cantidad > producto.existencia){
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                }else{
                    producto.existencia -= articulo.cantidad;
                    await producto.save();
                }
            }

            const nuevoPedido = new Pedido(input);
            nuevoPedido.vendedor = ctx.usuario.id;

            try {
                const resultado = await nuevoPedido.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarPedido: async (_, {id, input}, ctx, info) => {
            let pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error('Pedido no encontrado');
            }
            if(pedido.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese pedido');
            }

            let cliente = await Cliente.findById(input.cliente);
            if(!cliente){
                throw new Error('Cliente no encontrado');
            }
            if(cliente.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese cliente');
            }

            //Esto esta mal pero no se usa
            if(input.pedido){
                for await (const articulo of input.pedido) {
                    const {id} = articulo;
                    const producto = await Producto.findById(id);
                    if(articulo.cantidad > producto.existencia){
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                    }else{
                        producto.existencia -= articulo.cantidad;
                        await producto.save();
                    }
                }
            }
            
            const resultado = await Pedido.findOneAndUpdate({_id: id}, input, {new:true});
            return resultado;
        },
        eliminarPedido: async (_, {id}, ctx, info) => {
            let pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error('Pedido no encontrado');
            }
            if(pedido.vendedor.toString() !== ctx.usuario?.id){
                throw new Error('No te pertenece ese pedido');
            }
            await Pedido.findOneAndDelete({_id: id});
            return "Pedido eliminado";
        },
    }
}

module.exports = resolvers;