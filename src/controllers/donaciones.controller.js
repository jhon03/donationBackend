const {response, request} = require('express');
const { listDonaciones, findByid, findColeccion, updateStateDonacion, validarEstadoDonacion, openDonacion, cambiarEstadoDonacion, modificarDonacion, validarCorreoModel, enviarCorreo, generarDataCorreo } = require('../helpers');
const { sendCorreo } = require('../config');
const { DonacionTemporal } = require('../Domain/models');



const listAllDonaciones = async(req= request, res= response)=>{
    try {
        const {page, limite} = req.query;
        const {total, donaciones} = await listDonaciones(page, limite);
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
        const {detalles} = req.body;
        const donacionAct = await modificarDonacion(id, 'abrir', detalles);
        const correoE = await enviarCorreo(donacionAct, 'entregar');
        return res.json({
            donacionAct
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
        const {mensaje} = req.body;
        const donacion = await modificarDonacion(id, 'rechazar');
        const correoEnv = await enviarCorreo(donacion, 'rechazar', mensaje);
        return res.json({
            mensaje,
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
};

//controlador respuesta del benefactor a donacion
const formDonacion = async (req, res= response)=>{
    try {
        const {condicion} = req.params;
        const donacion = req.donacion;
        const modelo = findColeccion(donacion.tipo);
        let donacionAct;
        switch (condicion) {
            case 'aceptar':
                donacionAct = await cambiarEstadoDonacion(donacion, modelo, 'aceptar');
                break;
            case 'rechazar':
                donacionAct = await cambiarEstadoDonacion(donacion, modelo, 'rechazar');
                await enviarCorreo(donacionAct, 'rechazar_benefactor');
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


//controlador para retornar la donacion al benefactor
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

const verificarCorreoDonaciones = async (req, res) =>{
    try {
        const {correo, codigo} = req.body;
        const {coleccion} = await validarCorreoModel(correo, DonacionTemporal);
        if(coleccion.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(coleccion.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + coleccion.codigoConfir + " codigo: " + codigo)
        } 
        const modelo = findColeccion(coleccion.data.tipo);
        const donacion = new modelo(coleccion.data);
        coleccion.verificado = true;
        await coleccion.save();
        await donacion.save();
        const correoEnviado = await enviarCorreo(donacion ,'bienvenida');

        return res.status(201).json({
            msg: 'donacion creada con exito',
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const correoRecibido = async (req, res = response) =>{
    try {
        const {id} = req.params;
        const donacion = await modificarDonacion(id, 'recibido');
        const correoEnv = await enviarCorreo(donacion, 'recibido');
        return res.json({
            msg: 'donacion completada con exito',
            donacion
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


//controlador de prueba
const enviarCorreoPr = async (req, res) =>{
    try {
        const { correo } = req.params;
        let asunto = 'correo de prueba ';
        let contenido = '<h1> hola como estas </h1>'
        const correoEnv = await sendCorreo(correo, asunto, contenido );
        res.json({
            msg: 'correo enviado correctamente',
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al enviar el correo: ' + error.message
        });
    }
}




module.exports = {
    confirmarDonacionColaborador,
    correoRecibido,
    donacionBenefactor,
    enviarCorreoPr,
    formDonacion,
    donacionFindById,
    listAllDonaciones,
    rechazarDonacionColaborador,
    verificarCorreoDonaciones,
}