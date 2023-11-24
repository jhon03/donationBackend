const { request } = require("express");
const { obtenerEstado } = require("./programas.helpers");
const { Proyecto, Programa } = require("../Domain/models");
const { validarOpciones } = require("./bd-valiadators");

const buscarProyectos = async( req= request, vista= false, limite=5, desde=0)=>{
    try {

        let query = obtenerEstado(req, vista);
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

const buscarProyectoId = async(req, vista=false) =>{
    try {
        const {id} = req.params;
        const proyecto = await Proyecto.findOne({ _id : id, ...obtenerEstado(req, vista) })
                                   .populate('programa','nombre')
                                   .populate('imagenes','url');
        if(!proyecto){
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

const cambiarEstado = async (req, modelo ,ocultar=false, habilitar=false) => {
    try {
        console.log(modelo);
        const {id} = req.params;
        let query = buscarEstado(ocultar, habilitar)
        const coleccion = await modelo.findByIdAndUpdate(id, query, {new:true} );
        if (!coleccion ) {
            throw new Error(`${id}`);
        }
        return coleccion;
    } catch (error) {
        throw Error(`Error al actualizar el estado de el proyecto ${error.message}`);
    }
}

const updateProyecto = async(req) =>{
    try {
        const { id } = req.params;
        const {_id, estado, programa, imagenes ,...resto } = req.body;

        resto.fechaModificacion = new Date();
        const proyecto = await Proyecto.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
        return proyecto;
    } catch (error) {
        throw new Error(`Error al actualizar el proyecto: ${error.message}`)
    }

}

const buscarEstado = (ocultar = false, habilitar = false) =>{

    let query = {estado: 'eliminado'};
    if(ocultar){
        query = {estado: 'oculto'};
    }
    if(habilitar){
        query = {estado: 'visible'};
    }
    return query;
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
    cambiarEstado,
    proyectoFindById,
    updateProyecto,
}