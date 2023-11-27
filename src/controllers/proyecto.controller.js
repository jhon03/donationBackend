const { response, request} = require('express');

const {Proyecto} = require('../Domain/models'); 
const { buscarProyectos, buscarProyectoId, crearObjetoProyecto,cambiarEstado, updateProyecto, validarOpciones } = require('../helpers');

const obtenerProyectos = async(req = request, res = response) => {
    try {
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;

        const {total, proyecto} = await buscarProyectos(req, false, Number(limite), Number(desde) );
        console.log(proyecto);
        return res.json({
            total,
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
           error: error.message
        })
    }    
}

const obtenerProyectosVista = async(req = request, res = response) => {
    try {
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;

        const {total, proyecto} = await buscarProyectos(req, vista=true, Number(limite), Number(desde));
        res.json({
            total,
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
           error: error.message
        })
    }    
}

const obtenerProyectoId = async(req, res) => {
    try {
        const proyecto = await buscarProyectoId(req);
        res.json({
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }    
}

const obtenerProyectoIdVista = async(req, res) => {
    try {
        const proyecto = await buscarProyectoId(req, vista=true);
        res.json({
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }    
}

const eliminarProyecto = async(req, res= response) => {
    try {
        const proyecto = await cambiarEstado(req, Proyecto);
        res.json({
            msg: 'proyecto eliminado correctamenete',
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const ocultarProyecto = async(req, res= response) => {
    try {
        const proyecto = await cambiarEstado(req, Proyecto, ocultar=true);
        res.json({
            msg: 'proyecto ocultado correctamenete',
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }    
}

const habilitarProyecto = async(req, res= response)=>{
    try {
        const proyecto = await cambiarEstado(req, Proyecto, false ,habilitar=true)
        return res.json({
            msg: 'proyecto habilitado correctamente',
            proyecto
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


const crearProyecto = async (req, res = response) => {
    try {
        const {data, nombre} = crearObjetoProyecto(req);
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
        await proyecto.save();  //guardar en la base de datos
        res.status(201).json(proyecto);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const actualizarProyecto = async(req, res) => {
    try {
        const opciones = req.body.opcionesDonacion;
        console.log(opciones);
        validarOpciones(opciones);
        const proyecto = await updateProyecto(req);
        return res.json({
            proyecto
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'ha ocurrido un problema',
            error: error.message
        })
    }

    
}


module.exports = {   
    actualizarProyecto,
    crearProyecto,
    eliminarProyecto,
    habilitarProyecto,
    obtenerProyectos,
    obtenerProyectosVista,
    obtenerProyectoId,
    obtenerProyectoIdVista,
    ocultarProyecto,
}