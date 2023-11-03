const { response, request} = require('express');

const {DonacionPrograma} = require('../Domain/models'); 

const obtenerDonacionPrograma = async(req = request, res = response) => {

    const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            DonacionPrograma.countDocuments(),  //devuelve los datos por indice
            DonacionPrograma.find()
            .populate('programa','nombre')
           //.skip(Number(desde))
           //.limit(Number(limite))
    ]);

    res.json({
        total,
        donacion
    });
}

const obtenerDonacionProgramId = async(req, res) => {

    const {id} = req.params;
    const donacion = await DonacionPrograma.findById(id)
                                    .populate('programa','nombre');
                                    
    res.json({
        donacion
    });
}


const crearDonacionPrograma = async (req, res = response) => {

    const {idPrograma} = req.params;
    const {tipoIdentificacion, 
           numeroIdentificacion, 
           nombreBenefactor, 
           correo, 
           celular, 
           aporte
    } = req.body;

    //generar data aqui estan los datos necesarios para crear un programa
    const data = {
        tipoIdentificacion,
        numeroIdentificacion,
        nombreBenefactor,
        correo,
        celular,
        programa: idPrograma,
        aporte      
    }

    const donacion = new DonacionPrograma(data);
       
    await donacion.save();      //guardar en la base de datos
    res.status(201).json({
        msg:'la donacion fue creada con exito',
        donacion
    });
}



module.exports = {
    obtenerDonacionPrograma,
    obtenerDonacionProgramId,
    crearDonacionPrograma,
}