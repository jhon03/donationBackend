const { request, response } = require("express");
const { buscarColeccion, obtenerColeccionUrl, findColeccion, validarEstadoColeccion } = require("../helpers");

const validarExitsColeccion = async(req= request, res= response, next)=>{
    try {
        const {id} = req.params;
        const coleccionUrl =        obtenerColeccionUrl(req);
        console.log(`nombre de coleccion: ${coleccionUrl}`);
        if(coleccionUrl !== 'donaciones'){
            const coleccion =           findColeccion(coleccionUrl);
            console.log(coleccion);
            const coleccionEncontrada = await buscarColeccion(coleccion, coleccionUrl, id);
            req.coleccion = coleccionEncontrada;
            req.nomModelo = coleccionUrl;
            next();
        }
        next();
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const validarColeccion = async(req, res, next)=>{
    try {
        console.log(`coleccion: ${req.coleccion}, modelo: ${req.modelo}`);
        const coleccionV = req.coleccion;
        const modelo = req.nomModelo;
        console.log(`coleccion ${coleccionV}\nnombre modelo: ${modelo}`);
        validarEstadoColeccion(coleccionV, modelo);
        next();
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    validarColeccion,
    validarExitsColeccion,
}