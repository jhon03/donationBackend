const {response, request} = require('express');
const { listDonaciones, findByid, findColeccion, updateStateDonacion, validarEstadoDonacion, openDonacion, cambiarEstadoDonacion, modificarDonacion } = require('../helpers');

const listAllDonaciones = async(req= request, res= response)=>{
    try {
        const {pagina, limite} = req.query;
        const {total, donaciones} = await listDonaciones(pagina, limite);
        return res.json({
            total: donaciones.length,
            donaciones,
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const donacionFindById = async(req= request, res= response)=>{
    try {
        const {id} = req.params;
        const {pagina, limite} = req.query;
        const {total, donaciones} = await listDonaciones(1, 2000);
        const donacionEncontrada = findByid(id, donaciones);
        return res.json({
            donacion: donacionEncontrada
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const aceptarDonacion = async (req, res= response)=>{
    try {
        const {id} = req.params;
        const donacionAct = await modificarDonacion(id, aceptar=true, rechazar=false);
        console.log(`donacion act: ${donacionAct}`);
        return res.json({
            donacionAct
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const abrirDonacion = async (req, res= response)=>{

    try {
        const {id} = req.params;
        const donacionAct = await modificarDonacion(id, aceptar=false, rechazar=false);
        return res.json({
            donacion: donacionAct
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const rechazarDonacion = async (req, res = response) =>{
    try {
        const {id} = req.params;
        const donacionRechazada = await modificarDonacion(id, aceptar=false ,rechazar=true);
        return res.json({
            donacionRechazada
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}




module.exports = {
    abrirDonacion,
    aceptarDonacion,
    donacionFindById,
    listAllDonaciones,
    rechazarDonacion,
}