const { request } = require("express");
const { obtenerEstado } = require("./programas.helpers");
const { Proyecto, Programa } = require("../Domain/models");
const { validarOpciones } = require("./bd-valiadators");

const buscarProyectos = async( limite=5, desde=0, token ='')=>{
    try {

        let query = obtenerEstado(token);
        const [total, proyecto] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            Proyecto.countDocuments(query),  //devuelve los datos por indice
            Proyecto.find(query)
            .populate('programa','nombre')
            .populate('imagenes','url')
            .skip(desde)
            .limit(limite)
        ]);

        return { total, proyecto };
    } catch (error) {
        throw new Error('Ha ocurrido un error al buscar los proyectos' + error.message);
    }
}

const buscarProyectoId = async(id, token = '') =>{
    try {
        
        const proyecto = await Proyecto.findOne({ _id : id, ...obtenerEstado(token) })
                                   .populate('programa','nombre')
                                   .populate('imagenes','url');
        if(!proyecto || proyecto === null){
            throw new Error(`El proyecto con id ${id} no existe o esta oculto -estado`);
        }
        return proyecto;
    } catch (error) {
        throw new Error(`error al buscar el proyecto: ${error.message}`)
    }
}

const crearObjetoProyecto = (req) =>{
    try {
        const {idPrograma} = req.params;
        const {nombre, descripcion, imagen, costo, fechaInicio, fechaFinalizacion,colCreador, colModificador, tipoProyecto, opcionesDonacion} = req.body;
        validarOpciones(opcionesDonacion);

        //generar data aqui estan los datos necesarios para crear un programa
        const data = {
            programa:idPrograma,
            nombre: nombre.toUpperCase(),
            descripcion, 
            imagen, 
            costo,
            fechaInicio,
            fechaFinalizacion,
            colCreador, 
            colModificador,
            tipoProyecto,
            opcionesDonacion
        }
        return {data, nombre};
    } catch (error) {
        throw new Error(`Error al crear el objeto proyecto: ${error.message}`)
    }
  
}


const buscarEstado = (accion) =>{
    try {
        switch (accion) {
            case 'habilitar':           
                return {estado: 'visible'};
            case 'ocultar':
                return {estado: 'oculto'};
            case 'eliminar':
                return {estado: 'eliminado'};
            default:
                throw new Error(`accion ${accion} no validada`);
        }
    } catch (error) {
        throw new Error(`Error al validar el estado: ${error.message}`);
    }
    
}

const proyectoFindById = async(id= '') =>{
    try {
        const proyecto = await Proyecto.findById(id);
        if(!proyecto){
            throw new Error(`El proyecto no existe`);
        }
        return proyecto;
    } catch (error) {
        throw new Error('Error al buscar el proyecto: ' + error.message);
    }
}

module.exports = {
    buscarProyectos,
    buscarEstado,
    buscarProyectoId,
    crearObjetoProyecto,
    proyectoFindById,
}