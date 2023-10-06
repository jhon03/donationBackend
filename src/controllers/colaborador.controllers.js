const { response, request} = require('express');   //modulo para tipear respuesta
const bcryptjs = require('bcryptjs');

const Colaborador = require('../Domain/models/Colaborador.models');



const colaboradorGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};   //buscar solo usuarios activos
    

    const [total, colaboradores] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
        Colaborador.countDocuments(query),
        Colaborador.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        colaboradores
    });
}

const colaboradorPatch = (req, res) => {
    res.json({
        msg: 'patch api'
    });
}

const colaboradorDelete = async(req, res= response) => {

    const {id} = req.params;
    const colaborador = await Colaborador.findByIdAndUpdate(id, {estado:false});
    res.json(colaborador);
}

const colaboradorPost = async (req, res = response) => {

    const body = req.body; //desestructuramos el body
    const colaborador = new Colaborador(body);

    const salt = bcryptjs.genSaltSync();  //encriptar contraseña
    colaborador.contrasena= bcryptjs.hashSync( body.contrasena, salt);

    await colaborador.save(); //guardar en base de datos

    res.json({
        colaborador
    });
}

const colaboradorPut = async(req, res) => {
    const { id } = req.params;
    const {_id, rol, contrasena, correo, username, ...resto } = req.body;

    //validar
    if( contrasena){
        const salt = bcryptjs.genSaltSync();  //encriptar contraseña
        resto.contrasena= bcryptjs.hashSync( contrasena, salt);
    }

    resto.fechaModificacion = new Date();

    const colaborador = await Colaborador.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido

    res.json(colaborador);
}


module.exports = {
    colaboradorGet,
    colaboradorPatch,
    colaboradorDelete,
    colaboradorPost,
    colaboradorPut
}