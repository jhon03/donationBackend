const {response, request} = require('express');
const { listDonaciones, findByid, findColeccion, updateStateDonacion, validarEstadoDonacion, openDonacion, cambiarEstadoDonacion, modificarDonacion, dataCorrreoDonacion } = require('../helpers');
const { sendCorreo } = require('../config/mail');
const fs = require('fs');
const path = require('path');

const listAllDonaciones = async(req= request, res= response)=>{
    try {
        const {page, limite} = req.query;

        const {total, donaciones} = await listDonaciones(page, limite);
        console.log(total);
        console.log(donaciones);
        return res.json({
            total: donaciones.length,
            donacion: donaciones,
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

//enviar formulario al benefactor para rechazar o confirmar
const confirmarDonacionColaborador = async (req, res= response)=>{
    try {
        const {id} = req.params;
        const donacionAct = await modificarDonacion(id, aceptar=false, rechazar=false);
        const {destinatario, asunto, contenido} = await dataCorrreoDonacion(donacionAct.correo, donacionAct.nombreBenefactor, donacionAct._id, formEntrega=true);
        console.log(contenido);
        const correoEnv = await sendCorreo(destinatario, asunto, contenido);
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

const rechazarDonacionColaborador = async (req, res = response) =>{
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
};

const formDonacion = async (req, res= response)=>{
    try {
        const {condicion} = req.params;
        const donacion = req.donacion;
        console.log('donacion: ' + donacion);
        const modelo = findColeccion(donacion.tipo);
        let donacionAct;
        switch (condicion) {
            case 'aceptar':
                donacionAct = await cambiarEstadoDonacion(donacion, modelo, aceptar= true, rechazar= false);
                break;
            case 'rechazar':
                donacionAct = await cambiarEstadoDonacion(donacion, modelo, aceptar= false, rechazar= true);
                break;
            default:
                throw new Error(`Parametro no aceptado: ${condicion}` );
        }
        return res.json({
            donacionAct
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



const enviarCorreo = async (req, res= response) =>{
    try {
        const {correoBenefactor} = req.params;
        console.log(correoBenefactor);
        const {destinatario, asunto,contenido} = await dataCorrreoDonacion(correoBenefactor);
        const correo = await sendCorreo(destinatario,asunto,contenido);
        return res.json({
            correo,
            asunto
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        })
    }
}

const donacionBenefactor = (req, res)=>{
    try {
        const donacion = req.donacion;
        return res.json({
            donacion
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}




module.exports = {
    abrirDonacion,
    confirmarDonacionColaborador,
    donacionBenefactor,
    formDonacion,
    donacionFindById,
    enviarCorreo,
    listAllDonaciones,
    rechazarDonacionColaborador,
}