const { response, request} = require('express');

const {DonacionPrograma} = require('../Domain/models'); 

const obtenerDonacionPrograma = async(req = request, res = response) => {

    //const { limite = 5, desde = 0 } = req.query;
    //const query = {estado: true};   buscar solo programas activos
    

    const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            DonacionPrograma.countDocuments(),  //devuelve los datos por indice
            DonacionPrograma.find()
            .populate('programa','nombre')
           .skip(Number(desde))
           .limit(Number(limite))
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