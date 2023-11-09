const { response, request} = require('express');   //modulo para tipear respuesta


const {Programa} = require('../Domain/models');
const {validarOpciones} = require('../helpers');



const obtenerProgramas = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};   //buscar solo programas activos
    

    const [total, programas] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
        Programa.countDocuments(query),  //devuelve los datos por indice
        Programa.find(query)
           .populate('colaborador','nombre')
           .populate('imagenes','url')
           //.skip(Number(desde))
           //.limit(Number(limite))
    ]);

    res.json({
        total,
        programas
    });
}

const obtenerProgramasId = async(req, res) => {

    const {id} = req.params;
    const programa = await Programa.findById(id)
                                   .populate('colaborador','nombre')
                                   .populate('imagenes','url')


    res.json({
        msg: 'programa obtenido correctamente',
        programa
    });
}

const eliminarPrograma = async(req, res= response) => {

    const {id} = req.params;
    const programa = await Programa.findByIdAndUpdate(id, {estado:false}, {new:true} );
    res.json({
        msg: 'programa eliminado correctamenete',
        programa
    });
}

const crearPrograma = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();
        const opciones = req.body.opcionesColaboracion;
        validarOpciones(opciones);

        //generar data aqui estan los datos necesarios para crear un programa
        const data = {nombre, eslogan: req.body.eslogan, descripcion: req.body.descripcion, imagen: req.body.imagen, usuCreador: req.body.usuCreador, usuModificador: req.body.usuModificador, colaborador: req.usuario._id, opcionesColaboracion: req.body.opcionesColaboracion }

        const programaDB = await Programa.findOne({nombre});
        if(programaDB ){
            if(!programaDB.estado){
        
                const programaNue = new Programa(data);
                await programaNue.save();
                return res.status(201).json({
                    programaNue
                });
            }

            return res.status(400).json({
                msg: `El programa ${programaDB.nombre} ya existe`
            });
        }


        const programa = new Programa(data);
        
        //guardar en la base de datos
        await programa.save();

        res.status(201).json(programa);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }

    
}

const actualizarPrograma = async(req, res) => {

    try {
        const { id } = req.params;
        const {_id, imagenes, opcionesColaboracion, ...resto } = req.body;
        const opciones = req.body.opcionesColaboracion;
        validarOpciones(opciones);

        resto.fechaModificacion = new Date();

        const programa = await Programa.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
        res.json({
            programa
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}


module.exports = {
    obtenerProgramas,
    obtenerProgramasId,
    eliminarPrograma,
    crearPrograma,
    actualizarPrograma
}