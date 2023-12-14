const { response, request} = require('express');   //modulo para tipear respuesta
const bcryptjs = require('bcryptjs');

const Colaborador = require('../Domain/models/Colaborador.models');
const { ColaboradorTemp, Role } = require('../Domain/models');
const { enviarCorreo, validarCorreoModel } = require('../helpers');



const colaboradorGet = async(req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const tokenNuevo = req.tokenRenovado;
        const query = {estado: true};            //buscar solo usuarios activos
        
        const [total, colaboradores] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            Colaborador.countDocuments(query),
            Colaborador.find(query)
            .populate('rol', 'rol')
                //.skip(Number(desde))
                //.limit(Number(limite))
        ]);
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, total, colaboradores });
        }
        return res.json({
            total,
            colaboradores
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const colaboradorById = async (req, res) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const colaborador = await Colaborador.findOne({_id: id, estado: true})
                                            .populate('rol', 'rol');
        if(!colaborador){
            throw new Error(`El colaborador no existe`);
        }
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'programa obtenido correctamente', colaborador});
        }
        return res.json({colaborador});
    } catch (error) {
        return res.status(400).json({
            msg: 'error al obtener el colaborador',
            error: error.message,
        })
    }
}


const colaboradorDelete = async(req, res= response) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const colaborador = await Colaborador.findByIdAndUpdate(id, {estado:false}, {new:true});
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, colaborador});
        }
        return res.json(colaborador);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const colaboradorPost = async (req, res = response) => {
    try {
        const {fechaModificacion, fechaCreacion, estado, rol,  ...resto} = req.body;
        const role = await Role.findOne({rol});
        if(role && role !== null){
            resto.rol = role;
        } else {
            throw new Error("rol: " + role + error.message)
        }

        const colaborador = new Colaborador(resto);
        const salt = bcryptjs.genSaltSync();  //encriptar contraseña
        colaborador.contrasena= bcryptjs.hashSync( resto.contrasena, salt);
        await enviarCorreo(colaborador ,'confirmar');
        return res.json({
            msg: 'EL registro esta en espera mientras se confirma su correo',
            colaborador
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const colaboradorPut = async(req, res) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const { id } = req.params;
        const {_id, rol, username, contrasena, estado, ...resto } = req.body;
       //validar
        if( contrasena){
            const salt = bcryptjs.genSaltSync();  //encriptar nueva contraseña
            resto.contrasena= bcryptjs.hashSync( contrasena, salt);
        }
        if(username){;
            const colaboradorAct = await Colaborador.findById(id);
            if(username !== colaboradorAct.username){             
                const usuarioExi = await Colaborador.findOne({username})
                if(usuarioExi && usuarioExi.estado){
                    return res.status(409).json({
                        msg: 'Ya existe un usuario con ese nombre de usuario y está activo.'
                    });
                }
                resto.username = usuarioExi;
            }
        }
        resto.fechaModificacion = new Date();
        const colaborador = await Colaborador.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, colaborador});
        }
        return res.json(colaborador);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const verficarCorreoCol = async(req, res) => {
    try {
        const {correo, codigo} = req.body;
        const {coleccion} = await validarCorreoModel(correo, ColaboradorTemp);
        if(coleccion.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(coleccion.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + coleccion.codigoConfir + " codigo: " + codigo)
        } 
        const colaborador = new Colaborador(coleccion.data);
        coleccion.verificado = true;
        await coleccion.save();
        await colaborador.save();
        return res.status(201).json({
            msg: `Se ha verificado el correo, bienvenido: ${colaborador.nombre}`
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        })
    }
}


module.exports = {
    colaboradorGet,
    colaboradorDelete,
    colaboradorPost,
    colaboradorPut,
    verficarCorreoCol,
    colaboradorById,
}