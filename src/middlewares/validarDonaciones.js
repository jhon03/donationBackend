const { request } = require("express");
const { Proyecto } = require("../Domain/models");
const { buscarColeccion, validarEstadoColeccion, validarFechaDonacion, obtenerColeccionUrl, findColeccion, obtenermodeloUrl } = require("../helpers");



const validarDonacion = async(req = request, res, next)=>{

    try {
        const {id} = req.params;
        const modelo = obtenermodeloUrl(req);    //nombre de colecion
        console.log(modelo);
        const coleccion = findColeccion(modelo);    //coleccion
        console.log(coleccion);
        const coleccionDona = await buscarColeccion(coleccion, modelo, id);
        console.log(coleccionDona)
        validarEstadoColeccion(coleccionDona, modelo);
        if(modelo === 'proyecto'){
            validarFechaDonacion(coleccionDona, modelo);
        }
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