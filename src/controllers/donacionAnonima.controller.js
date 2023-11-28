const { response, request} = require('express');

const {DonacionAno, DonacionTemporal} = require('../Domain/models'); 
const { enviarCorreo, validarCorreoModel, obtenerDonaciones, mapearData } = require('../helpers');
const { sendCorreo } = require('../config/mail');

const obtenerDonacionesAnonimas = async(req = request, res = response) => {
    try {        
        const {total, coleccion: donacion} = await obtenerDonaciones(DonacionAno, 'proyecto');
        return res.json({
            total,
            donacion
        });        
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

}

const obtenerDonacionAId = async(req, res) => {
    try {
        const {id} = req.params;
        const donacion = await DonacionAno.findById(id)
                                        .populate('proyecto','nombre');
                                        
        return res.json({
            donacion
        });
    } catch (error) {
        return res.estatus(400).json({
            error: error.message
        })
    }
    
}


const crearDonacionAno = async (req, res = response) => {
    try {
        const data = mapearData(req);      
        let accion =  'confirmar';
        let msg = 'la donacion esta en espera mientras se confirma su correo';
        const donacion = new DonacionAno(data);   //prueba primero verificar correo
        const {coleccion, estado} = await validarCorreoModel(data.correo, DonacionTemporal);
        if(estado === 'verificado'){
            await donacion.save();
            accion = 'bienvenida';
            msg= "donacion creada con exito " + donacion.nombreBenefactor;
        }
        console.log(donacion);
        const correoEnviado = await enviarCorreo(donacion ,accion);
        console.log(correoEnviado);
        return res.json({
            accion,
            msg
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const verificarCorreoDoProyecto = async (req, res) =>{
    try {
        const {correo, codigo} = req.body;
        const {coleccion} = await validarCorreoModel(correo, DonacionTemporal);
        if(coleccion.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(coleccion.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + coleccion.codigoConfir + " codigo: " + codigo)
        } 
        const donacionProyecto = new DonacionAno(coleccion.data);
        coleccion.verificado = true;
        await coleccion.save();
        await donacionPrograma.save();
        const correoEnviado = await enviarCorreo(donacionProyecto ,'bienvenida');

        return res.status(201).json({
            msg: 'donacion creada con exito',
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



module.exports = {
    obtenerDonacionesAnonimas,
    obtenerDonacionAId,
    crearDonacionAno,
    verificarCorreoDoProyecto,
}