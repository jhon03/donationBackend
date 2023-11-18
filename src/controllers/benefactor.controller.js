const { response, request} = require('express');
const bcryptjs = require('bcryptjs');

const {Benefactor} = require('../Domain/models'); 

const obtenerBenefactores = async(req = request, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = {estado: true};   //buscar solo programas activos
        const [total, benefactor] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
                Benefactor.countDocuments(query),  //devuelve los datos por indice
                Benefactor.find(query)
            //.skip(Number(desde))
            //.limit(Number(limite))
        ]);
        return res.json({
            total,
            benefactor
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const obtenerBenefactorId = async(req, res) => {
    try {
        const {id} = req.params;
        const benefactor = await Benefactor.findById(id);

        return res.json({
            benefactor
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const eliminarBenefactor = async(req, res= response) => {
    try {
        const {id} = req.params;
        const benefactor = await Benefactor.findByIdAndUpdate(id, {estado:false}, {new:true} );
        if (!benefactor ) {
            return res.status(400).json({
                msg: 'El benefactor que intentas eliminar no existe'
            })
        }
        return res.json({
            msg: 'benefactor eliminado correctamenete',
            benefactor
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const crearBenefactor = async (req, res = response) => {
    try {
        const {nombre, tipoIdentificacion, numeroIdentificacion, correo, contrasena ,celular} = req.body;
        const salt = bcryptjs.genSaltSync();
        const contrasenaEn= bcryptjs.hashSync(contrasena, salt);       
        const data = {             //generar data aqui estan los datos necesarios para crear un benefactor
            nombre,
            tipoIdentificacion,
            numeroIdentificacion,
            correo,
            contrasena:contrasenaEn,
            celular       
        }
        const benefactor = new Benefactor(data);
        await benefactor.save();     //guardar en la base de datos
        res.status(201).json(benefactor);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const actualizarBenefactor = async(req, res) => {
    try {
        const { id } = req.params;
        const {_id, ...resto } = req.body;

        resto.fechaModificacion = new Date();

        const benefactor = await Benefactor.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
        if(!benefactor.estado){
            return res.status(400).json({
                msg: 'no se puede actualizar -id-estado=false'
            });
        }
        return res.json({
            benefactor
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    obtenerBenefactores,
    obtenerBenefactorId,
    eliminarBenefactor,
    crearBenefactor,
    actualizarBenefactor
}