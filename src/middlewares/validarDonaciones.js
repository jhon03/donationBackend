const { request } = require("express");
const { Proyecto } = require("../Domain/models");
const { buscarColeccion, validarEstadoColeccion, validarFechaDonacion, obtenerColeccionUrl, findColeccion, obtenermodeloUrl } = require("../helpers");



const validarDonacion = async(req = request, res, next)=>{

    try {
        const {id} = req.params;
        const modelo = obtenermodeloUrl(req);    //nombre de colecion
        console.log("modelo" +modelo);
        const coleccion = findColeccion(modelo);    //coleccion
        console.log("coleccion: " + coleccion);
        const coleccionDona = await buscarColeccion(coleccion, modelo, id);
        console.log("coleccion domacion: " + coleccionDona)
        validarEstadoColeccion(coleccionDona, modelo);
        console.log("paso validacion de estado de coleccion");
        if(modelo === 'proyecto'){
            validarFechaDonacion(coleccionDona, modelo);
        }
        console.log("paso validacion donacion")
        next();

    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    validarDonacion,
}