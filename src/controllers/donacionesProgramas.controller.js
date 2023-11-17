const { response, request} = require('express');
const {DonacionPrograma, DonacionTemporal} = require('../Domain/models'); 
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { dataCorrreoDonacion, generarDataCorreo, validarCorreoDona, enviarCorreo } = require('../helpers');
const { sendCorreo } = require('../config/mail');

const obtenerDonacionPrograma = async(req = request, res = response) => {
    try {
        const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            DonacionPrograma.countDocuments(),  //devuelve los datos por indice
            DonacionPrograma.find().sort({fechaCreacion: -1})
            .populate('programa','nombre')
          //.skip(Number(desde))
           //.skip(Number(desde))
            //.limit(Number(limite))
        ]);

        res.json({
            total,
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }   
}

const obtenerDonacionProgramId = async(req, res) => {
    try {
        const {id} = req.params;
        const donacion = await DonacionPrograma.findById(id)
                                        .populate('programa','nombre');                                       
        return res.json({
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

//end point queda la donacion en espera hasta que se confirme el correo
const crearDonacionPrograma = async (req, res = response) => {
    try {
        const {id} = req.params;
        const data = {                      //generar data aqui estan los datos necesarios para crear un programa
            tipoIdentificacion: req.body.tipoIdentificacion,
            numeroIdentificacion: req.body.numeroIdentificacion,
            nombreBenefactor: req.body.nombreBenefactor,
            correo: req.body.correo,
            celular: req.body.celular,
            programa: id,
            aporte: req.body.aporte,   
        }
        let accion =  'confirmar';
        let msg = 'la donacion esta en espera mientras se confirma su correo';
        const donacion = new DonacionPrograma(data);   //prueba primero verificar correo
        const {donacionTemp, estado} = await validarCorreoDona(data.correo);
        console.log('El correo del benefactor esta: ' + estado);
        if(estado === 'verificado'){
            await donacion.save();
            accion = 'bienvenida';
            msg= "donacion creada con exito " + donacion.nombreBenefactor;
        }
        const correoEnviado = await enviarCorreo(donacion._id, donacion.nombreBenefactor, donacion.correo, donacion ,accion);
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

// const verificarCorreoDona = async (req, res) =>{
//     try {
//         const {correo, codigo} = req.body;
//         const {donacionTemp} = await validarCorreoDona(correo);
//         if(donacionTemp.verificado){
//             throw new Error("el correo ya ha sido verificado");
//         }
//         if(donacionTemp.codigoConfir !== codigo){
//             throw new Error('El codigo que introducite no coincide' + donacionTemp.codigoConfir + " codigo: " + codigo)
//         } 
//         const donacionPrograma = new DonacionPrograma(donacionTemp.data);
//         donacionTemp.verificado = true;
//         await donacionTemp.save();
//         await donacionPrograma.save();
//         const correoEnviado = await enviarCorreo(donacionPrograma._id, donacionPrograma.nombreBenefactor, donacionPrograma.correo, donacionPrograma ,'bienvenida');

//         return res.status(201).json({
//             msg: 'donacion creada con exito',
//         })
//     } catch (error) {
//         return res.status(400).json({
//             error: error.message
//         })
//     }
// }



module.exports = {
    obtenerDonacionPrograma,
    obtenerDonacionProgramId,
    crearDonacionPrograma,

    //verificarCorreoDona,
}