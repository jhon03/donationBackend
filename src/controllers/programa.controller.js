const { response, request} = require('express');   //modulo para tipear respuesta


const {Programa} = require('../Domain/models');



const programaGet = async(req = request, res = response) => {

    //const { limite = 5, desde = 0 } = req.query;
    //const query = {estado: true};   //buscar solo usuarios activos
    

    //const [total, colaboradores] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
        //Colaborador.countDocuments(query),
        //Colaborador.find(query)
           // .skip(Number(desde))
           // .limit(Number(limite))
   // ]);

    res.json({
        msg: 'get programas'
    });
}

const programaGetId = (req, res) => {

    const {id} = req.params;

    res.json({
        msg: `obtener programa ${id}`
    });
}

const programaDelete = async(req, res= response) => {

    //const {id} = req.params;
    //const colaborador = await Colaborador.findByIdAndUpdate(id, {estado:false});
    res.json({
        msg: 'delete programa id'
    });
}

const programaPost = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const programaDB = await Programa.findOne({nombre});
    if(programaDB){
        return res.status(400).json({
            msg: `El programa ${programaDB.nombre} ya existe`
        });
    }


    //generar data
    const data = {
        nombre,
        eslogan: req.body.eslogan,
        descripcion:req.body.descripcion,
        tipoAporte:req.body.tipoAporte,
        costo:req.body.costo,
        imagen:req.body.imagen,
        usuCreador:req.body.usuCreador,
        usuModificador:req.body.usuModificador,
        colaborador: req.usuario._id
    }

    const programa = new Programa(data);
    
    //guardar en la base de datos
    await programa.save();

    res.status(201).json(programa);
}

const programaPut = async(req, res) => {
    //const { id } = req.params;
    //const {_id, rol, contrasena, correo, username, ...resto } = req.body;

    //validar
    //if( contrasena){
    //    const salt = bcryptjs.genSaltSync();  //encriptar contraseña
    //    resto.contrasena= bcryptjs.hashSync( contrasena, salt);
    //}

    //resto.fechaModificacion = new Date();

    //const colaborador = await Colaborador.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido

    res.json({
        msg: 'actualizar programa por id'
    });
}


module.exports = {
    programaGet,
    programaGetId,
    programaDelete,
    programaPost,
    programaPut
}