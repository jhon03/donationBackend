const { response, request} = require('express');
const {DonacionPrograma} = require('../Domain/models'); 
const {validarCorreoDona, enviarCorreo, mapearData, obtenerDonaciones } = require('../helpers');


const obtenerDonacionPrograma = async(req = request, res = response) => {
    try {
        const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            DonacionPrograma.countDocuments(),  //devuelve los datos por indice
            DonacionPrograma.find().sort({fechaCreacion: -1})
            .populate('programa','nombre')
           //.skip(Number(desde))
            //.limit(Number(limite))
        ]);

        const {total, coleccion: donacion} = await obtenerDonaciones(DonacionPrograma, 'programa');
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
        const data = mapearData(req);
        let accion =  'confirmar';
        let msg = 'la donacion esta en espera mientras se confirma su correo';
        const donacion = new DonacionPrograma(data);   //prueba primero verificar correo
        const {donacionTemp, estado} = await validarCorreoDona(data.correo);
        if(estado === 'verificado'){
            await donacion.save();
            accion = 'bienvenida';
            msg= "donacion creada con exito " + donacion.nombreBenefactor;
        }
        const correoEnviado = await enviarCorreo(donacion ,accion);
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


module.exports = {
    obtenerDonacionPrograma,
    obtenerDonacionProgramId,
    crearDonacionPrograma,
}