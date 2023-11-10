const { response, request} = require('express');

const {Donacion} = require('../Domain/models'); 

const obtenerDonaciones = async(req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = {estado: true};   //buscar solo programas activos
        const [total, donacion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
                Donacion.countDocuments(query),  //devuelve los datos por indice
                Donacion.find(query)
                .populate('benefactor','nombre')
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

const obtenerDonacionId = async(req, res) => {
    try {
        const {id} = req.params;
        const donacion = await Donacion.findById(id)
                                        .populate('benefactor','nombre')
                                        .populate('proyecto','nombre');
                                        
        if(!donacion  || !donacion.estado){
            return res.status(404).json({
            msg: "No existe el proyecto"
            });
        } 

        return res.json({
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const eliminarDonacion = async(req, res= response) => {

    try {
        const {id} = req.params;
        const donacion = await Donacion.findByIdAndUpdate(id, {estado:false}, {new:true} );
        if (!donacion ) {
            return res.status(400).json({
                msg: 'El benefactor que intentas eliminar no existe'
            })
        }
        return res.json({
            msg: 'benefactor eliminado correctamenete',
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const crearDonacion = async (req, res = response) => {
    try {
        const {idProyecto} = req.params;
        const data = {                          //generar data aqui estan los datos necesarios para crear un programa
            benefactor: req.usuario._id,
            aporte: req.body.aporte,
            proyecto: idProyecto,      
        }

        const donacion = new Donacion(data);
        
        //guardar en la base de datos
        await donacion.save();
        res.status(201).json(donacion);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const actualizarDonacion = async(req, res) => {
    try {
        const { id } = req.params;
        const {_id,benefactor, proyecto, fechaCreacion, estado, ...resto } = req.body;


        const donacion = await Donacion.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
        if(!donacion.estado){
            return res.status(400).json({
                msg: 'no se puede actualizar -id-estado=false'
            });
        }
        return res.json({
            donacion
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}


module.exports = {
    obtenerDonaciones,
    obtenerDonacionId,
    eliminarDonacion,
    crearDonacion,
    actualizarDonacion
}