const { response, request} = require('express');

const {Proyecto} = require('../Domain/models'); 

const obtenerProyectos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};   //buscar solo programas activos
    

    const [total, proyecto] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
            Proyecto.countDocuments(query),  //devuelve los datos por indice
            Proyecto.find(query)
           .skip(Number(desde))
           .limit(Number(limite))
    ]);

    res.json({
        total,
        proyecto
    });
}

const obtenerProyectoId = async(req, res) => {

    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);
    if(!proyecto  || !proyecto.estado){
        res.status(404).json({
          msg: "No existe el proyecto"
        });
    }

    res.json({
        proyecto
    });
}

const eliminarProyecto = async(req, res= response) => {

    const {id} = req.params;
    const proyecto = await Proyecto.findByIdAndUpdate(id, {estado:false}, {new:true} );
    res.json({
        msg: 'proyecto eliminado correctamenete',
        proyecto
    });
}

const crearProyecto = async (req, res = response) => {

    const {idPrograma} = req.params;

    const nombre = req.body.nombre.toUpperCase();

    //generar data aqui estan los datos necesarios para crear un programa
    const data = {
        programa:idPrograma,
        nombre,
        descripcion: req.body.descripcion, 
        imagen: req.body.imagen, 
        costo: req.body.costo,
        fechaInicio: req.body.fechaInicio,
        fechaFinalizacion: req.body.fechaFinalizacion,
        colCreador: req.body.colCreador, 
        colModificador: req.body.colModificador,
        tipoProyecto: req.body.tipoProyecto
    }

    const proyectoDB = await Proyecto.findOne({nombre});
    if(proyectoDB ){
        if(!proyectoDB.estado){
    
            const programaNue = new Proyecto(data);
            await programaNue.save();
            return res.status(201).json({
                programaNue
            });
        }

        return res.status(400).json({
            msg: `El Proyecto ${proyectoDB.nombre} ya existe`
        });
    }


    const proyecto = new Proyecto(data);
    
    //guardar en la base de datos
    await proyecto.save();

    res.status(201).json(proyecto);
}

const actualizarProyecto = async(req, res) => {
    const { id } = req.params;
    const {_id, ...resto } = req.body;

    resto.fechaModificacion = new Date();

    const proyecto = await Proyecto.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido

    res.json({
        proyecto
    });
}


module.exports = {
    obtenerProyectos,
    obtenerProyectoId,
    eliminarProyecto,
    crearProyecto,
    actualizarProyecto
}
