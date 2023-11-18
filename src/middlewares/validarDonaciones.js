const { request } = require("express");
const { Proyecto } = require("../Domain/models");
const { buscarColeccion, validarEstadoColeccion, validarFechaDonacion } = require("../helpers");



const validarDonacion = async(req = request, res, next)=>{

    try {
        const {id} = req.params;
        const proyecto = await buscarColeccion(Proyecto, 'Proyecto', id);
        validarEstadoColeccion(proyecto, 'Proyecto');
        validarFechaDonacion(proyecto, 'Proyecto');
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