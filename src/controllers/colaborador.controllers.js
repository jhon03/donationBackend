const { response, request} = require('express');   //modulo para tipear respuesta

const Colaborador = require('../Domain/models/Colaborador.models');
const { ColaboradorTemp, Role } = require('../Domain/models');
const { enviarCorreo, validarCorreoModel, encryptarContra, buscarDocumentos, obtenerOpcionesBus } = require('../helpers');



const colaboradorGet = async(req = request, res = response) => {
    try {
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;
        const tokenNuevo = req.tokenRenovado;
        const busqueda = {estado: true};            //buscar solo usuarios activos

        const opcionesBusqueda = obtenerOpcionesBus('colaborador');
        
        const {total, docs: colaboradores} = await buscarDocumentos(Colaborador, opcionesBusqueda, Number(limite), Number(desde), busqueda);
        const listaOrdenada = colaboradores.sort((a, b) => b.fechaCreacion - a.fechaCreacion );
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, total, colaboradores });
        }
        return res.json({
            total,
            colaboradores: listaOrdenada
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
        if(!colaborador || colaborador === null){
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
        const {fechaModificacion, fechaCreacion, contrasena, estado, rol,  ...resto} = req.body;
        const role = await Role.findOne({rol});
        if(role && role !== null){
            resto.rol = role;
        } else {
            throw new Error("rol: " + role + error.message)
        }

        encryptarContra(resto, contrasena);
        const colaborador = new Colaborador(resto);

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
        const {_id, rol, username, contrasena, estado, correo, ...resto } = req.body;
        if(id !== String(req.usuario._id)){
            console.log(`id a editar: ${id}\n`)
            console.log(String(req.usuario._id));
            throw new Error('No tienes permiso para editar la informacion de este usuario');
        }
       //validar
        if( contrasena){
            encryptarContra(resto, contrasena);
        }
        if(username){;
            const colaboradorAct = await Colaborador.findById(id);
            if(username !== colaboradorAct.username){             
                const usuarioExi = await Colaborador.findOne({username})
                if(usuarioExi && usuarioExi.estado){
                    throw new Error(`Ya existe un username con el nombre de ${username}`);
                }
                resto.username = username;
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
        coleccion.verificado = true;
        await coleccion.save();
        const colaborador = new Colaborador(coleccion.data);
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