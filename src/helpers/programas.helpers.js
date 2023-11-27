const { request } = require('express');
const {Programa} = require('../Domain/models');
const { obtenerToken } = require('./jwt.helpers');
const { validarOpciones } = require('./bd-valiadators');


const buscarProgramas = async (req , vista = false, limite = 5, desde = 0,) => {
    try {

        let query = obtenerEstado(req, vista);

        const [total, programas] = await Promise.all([
            Programa.countDocuments(query),
            Programa.find(query)
                .populate('colaborador', 'nombre')
                .populate('imagenes', 'url')
                .skip(desde)
                .limit(limite)
        ]);

        return { total, programas };
    } catch (error) {
        throw new Error('Ha ocurrido un error al buscar los programas' + error.message);
    }
    
};

const buscarProgramaId = async(req, vista=false) =>{
    try {
        const {id} = req.params;
        const programa = await Programa.findOne({ _id : id, ...obtenerEstado(req, vista) })
                                   .populate('colaborador','nombre')
                                   .populate('imagenes','url');
        if(!programa){
            throw new Error(`El programa con id ${id} no existe o esta oculto -estado`);
        }
        return programa;
    } catch (error) {
        throw new Error(`error al buscar el programa: ${error.message}`)
    }
}

const obtenerEstado = (req = request, vista) =>{

    let query = { estado: 'visible' }; // Utiliza el estado proporcionado
    const token = obtenerToken(req);
    if(vista){
        return query;
    }
    if(token != undefined || token != null){
        query = { estado: { $in: ['visible', 'oculto'] } };
    }
    return query;
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
    buscarProgramas,
    buscarProgramaId,
    crearObjetoPrograma,
    obtenerEstado,
    programaFindById,
};
