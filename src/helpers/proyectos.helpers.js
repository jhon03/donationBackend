const { request } = require("express");
const { obtenerEstado } = require("./programas.helpers");
const { Proyecto, Programa } = require("../Domain/models");
const { validarOpciones } = require("./bd-valiadators");


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
    buscarEstado,
    crearObjetoProyecto,
    proyectoFindById,
}