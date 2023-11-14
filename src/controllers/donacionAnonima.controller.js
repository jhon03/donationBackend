const { response, request} = require('express');

const {DonacionAno} = require('../Domain/models'); 
const { dataCorrreoDonacion } = require('../helpers');
const { sendCorreo } = require('../config/mail');

const obtenerDonacionesAnonimas = async(req = request, res = response) => {
    try {        
        const { limite = 5, desde = 0 } = req.query;
        const query = {estado: true};   //buscar solo programas activos
        const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
                DonacionAno.countDocuments(),  //devuelve los datos por indice
                DonacionAno.find()
                .populate('proyecto','nombre')
            //.skip(Number(desde))
            //.limit(Number(limite))
        ]);

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
        const {id} = req.params;
        const {tipoIdentificacion, numeroIdentificacion, nombreBenefactor, correo, celular, aporte} = req.body;
        const data = {              //generar data aqui estan los datos necesarios para crear un programa
            tipoIdentificacion,
            numeroIdentificacion,
            nombreBenefactor,
            correo,
            celular,
            proyecto: id,
            aporte      
        }
        const donacion = new DonacionAno(data);
        const donacionProyecto = await donacion.save();      //guardar en la base de datos
        const {destinatario, asunto, contenido} = dataCorrreoDonacion(donacionProyecto.correo, donacionProyecto.nombreBenefactor , donacionProyecto._id);
        const enviarCorreo = await sendCorreo(destinatario, asunto, contenido);
        return res.status(201).json({
            msg:'la donacion fue creada con exito',
            donacionProyecto
        });
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
}