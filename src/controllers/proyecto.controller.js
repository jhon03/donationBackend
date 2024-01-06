const { response, request} = require('express');

const {Proyecto} = require('../Domain/models'); 
const { crearObjetoProyecto, obtenerToken, cambiarEstadoColeccion, updateColeccion, validarOpciones, buscarDocumentos, buscarDocumentoId, obtenerEstado, obtenerOpcionesBus } = require('../helpers');

const obtenerProyectos = async(req = request, res = response) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;
        const token = req.params;

        const busqueda = obtenerEstado(token);

        const opcionesBusqueda = obtenerOpcionesBus('proyecto');
        const {total, docs: proyecto} = await buscarDocumentos(Proyecto, opcionesBusqueda, Number(limite), Number(desde), busqueda);

        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, total, proyecto});
        }
        return res.json({total, proyecto });
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
        const busqueda = obtenerEstado();

        const opcionesBusqueda = obtenerOpcionesBus('proyecto');
        //no se pasa el atributo de token, ya que al ser la vista no es necesario
        const {total, docs: proyecto} = await buscarDocumentos(Proyecto, opcionesBusqueda, Number(limite), Number(desde), busqueda);
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

const obtenerProyectoId = async(req, res) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const token = obtenerToken(req);

        const opcionesBusqueda = obtenerOpcionesBus('proyecto');
        const proyecto = await buscarDocumentoId(Proyecto, id, opcionesBusqueda, token);
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, proyecto});
        }
        return res.json({
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
        const {id} = req.params;
        const opcionesBusqueda = obtenerOpcionesBus('proyecto');
        const proyecto = await buscarDocumentoId(Proyecto, id, opcionesBusqueda);
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
        const {id} = req.params;
        const proyecto = await cambiarEstadoColeccion(Proyecto, id, 'eliminar');
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
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const proyecto = await cambiarEstadoColeccion(Proyecto ,id, 'ocultar');
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'proyecto ocultado correctamenete', proyecto});
        }
        return res.json({
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
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const proyecto = await cambiarEstadoColeccion(Proyecto ,id, 'habilitar');
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'proyecto habilitado correctamente', proyecto});
        }
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
        const tokenNuevo = req.tokenRenovado;
        const {data, nombre} = crearObjetoProyecto(req);
        const proyectoDB = await Proyecto.findOne({nombre});
        if(proyectoDB ){
            if(!proyectoDB.estado){
        
                const proyectoNue = new Proyecto(data);
                await proyectoNue.save();
                if(tokenNuevo && tokenNuevo !== null){
                    return res.json({tokenNuevo, proyectoNue});
                }
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
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, proyecto});
        }
        res.status(201).json(proyecto);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const actualizarProyecto = async(req, res) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const { id } = req.params;
        const {_id, estado, programa, imagenes ,...resto } = req.body;
        validarOpciones(resto.opcionesDonacion);

        const proyecto = await updateColeccion(Proyecto, id, resto);
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, proyecto});
        }
        return res.json({
            proyecto
        });
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al actualizar el proyecto',
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
