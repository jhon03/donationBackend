const { response, request} = require('express');

const {DonacionAno} = require('../Domain/models'); 

const obtenerDonacionesAnonimas = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};   //buscar solo programas activos
    

    const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            DonacionAno.countDocuments(),  //devuelve los datos por indice
            DonacionAno.find()
            .populate('proyecto','nombre')
           .skip(Number(desde))
           .limit(Number(limite))
    ]);

    res.json({
        total,
        donacion
    });
}

const obtenerDonacionAId = async(req, res) => {

    const {id} = req.params;
    const donacion = await DonacionAno.findById(id)
                                    .populate('proyecto','nombre');
                                    
    res.json({
        donacion
    });
}


const crearDonacionAno = async (req, res = response) => {

    const {idProyecto} = req.params;
    const {tipoIdentificacion, numeroIdentificacion, nombreBenefactor, correo, celular, aporte} = req.body;

    //generar data aqui estan los datos necesarios para crear un programa
    const data = {
        tipoIdentificacion,
        numeroIdentificacion,
        nombreBenefactor,
        correo,
        celular,
        proyecto: idProyecto,
        aporte      
    }

    const donacion = new DonacionAno(data);
       
    await donacion.save();      //guardar en la base de datos
    res.status(201).json({
        msg:'la donacion fue creada con exito',
        donacion
    });
}



module.exports = {
    obtenerDonacionesAnonimas,
    obtenerDonacionAId,
    crearDonacionAno,
}