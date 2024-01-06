const { request } = require('express');
const {Programa} = require('../Domain/models');
const { obtenerToken } = require('./jwt.helpers');
const { validarOpciones } = require('./bd-valiadators');

const obtenerEstado = (token = '') =>{
    try {
        let query = { estado: 'visible' }; // Utiliza el estado proporcionado
        if(!token || token === null){
            console.log('solicitud sin token');
            return query;
        }
        if(token && token !== null ){
            console.log('solicitud con token');
            query = { estado: { $in: ['visible', 'oculto'] } };
        }
        return query;
    } catch (error) {
        throw error;
    }   
}

const crearObjetoPrograma = (req) =>{
    try {
        const nombre = req.body.nombre.toUpperCase();
        const opciones = req.body.opcionesColaboracion;
        validarOpciones(opciones);
        console.log(req.body);

        const data = {
            nombre, 
            eslogan: req.body.eslogan, 
            descripcion: req.body.descripcion, 
            imagen: req.body.imagen, 
            usuCreador: req.body.usuCreador, 
            usuModificador: req.body.usuModificador, 
            colaborador: req.usuario._id, 
            opcionesColaboracion: req.body.opcionesColaboracion 
        }
        return {data, nombre};
    } catch (error) {
        throw new Error(`error al crear el objeto programa: ${error.message}`);
    }

    
}

const programaFindById = async(id='') =>{
    try {
        const programa = await Programa.findById(id);
        if(!programa){
            throw new Error(`El programa no existe: ${error.message}`);
        }
        return programa;
    } catch (error) {
        throw new Error('Error al buscar el programa: ' + error.message);
    }
}


module.exports = {
    crearObjetoPrograma,
    obtenerEstado,
    programaFindById,
};
