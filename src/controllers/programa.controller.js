const { response, request} = require('express');   //modulo para tipear respuesta


const {Programa} = require('../Domain/models');
const { validarOpciones, crearObjetoPrograma, obtenerToken, cambiarEstadoColeccion, updateColeccion, buscarDocumentos, buscarDocumentoId, obtenerEstado, obtenerOpcionesBus } = require('../helpers');



const obtenerProgramas = async(req = request, res = response) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;
        const token = obtenerToken(req);
        const busqueda = obtenerEstado(token);

        const opcionesBusqueda = obtenerOpcionesBus('programa');

        const {total, docs: programas} = await buscarDocumentos(Programa, opcionesBusqueda, Number(limite), Number(desde), busqueda);
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, total, programas});
        }
        return res.json({
            total,
            programas
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
    
}

const obtenerProgramasVista = async(req=request, res= response)=>{
    try {

        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;
        const busqueda = obtenerEstado();

        const opcionesBusqueda = obtenerOpcionesBus('programa');
        const {total, docs: programas} = await buscarDocumentos(Programa, opcionesBusqueda, Number(limite), Number(desde), busqueda);
        return res.json({
            total,
            programas
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const obtenerProgramasId = async(req, res) => {

    try {
        const {id} = req.params;
        const tokenNuevo = req.tokenRenovado;
        const token = obtenerToken(req);
        const opcionesBusqueda = obtenerOpcionesBus('programa');
        const programa = await buscarDocumentoId(Programa, id, opcionesBusqueda, token);

        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'programa obtenido correctamente', programa});
        }
        return res.json({
            msg: 'programa obtenido correctamente',
            programa
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
   
}

const obtenerProgramaIdVista = async(req, res) =>{
    try {
        const {id} = req.params;
        const opcionesBusqueda = obtenerOpcionesBus('programa');
        const programa = await buscarDocumentoId(Programa, id, opcionesBusqueda);
        return res.json({
            msg: 'programa obtenido correctamente',
            programa
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const eliminarPrograma = async(req, res= response) => {

    try {
        const {id} = req.params;
        const programa = await cambiarEstadoColeccion(Programa, id, 'eliminar');
        return res.json({
            msg: 'programa eliminado correctamenete',
            programa
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const crearPrograma = async (req, res = response) => {

    try {
        const tokenNuevo = req.tokenRenovado;
        const {data, nombre} = crearObjetoPrograma(req);        //generar data aqui estan los datos necesarios para crear un programa 'mapper'
        const programaDB = await Programa.findOne({nombre});
        if(programaDB ){
            if(programaDB.estado === 'eliminado'){
        
                const programaNue = new Programa(data);
                await programaNue.save();
                if(tokenNuevo && tokenNuevo !== null){
                    return res.json({tokenNuevo, programaNue});
                }
                return res.status(201).json({
                    programaNue
                });
            }

            throw new Error(`El programa ${programaDB.nombre} ya existe`);
        }


        const programa = new Programa(data);
        await programa.save();  //guardar en la base de datos
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, programa});
        }
        return res.status(201).json(programa);

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }

    
}

const actualizarPrograma = async(req, res) => {
    try {
        const tokenNuevo = req.tokenRenovado;
        const { id } = req.params;
        const {_id, imagenes, ...resto } = req.body;
        const opciones = req.body.opcionesColaboracion;
        validarOpciones(opciones);

        const programa = await updateColeccion(Programa, id, resto);  //usamos el new:true para devolver el objeto actualido
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, programa});
        }
        res.json({
            programa
         });
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
    
}

const ocultarPrograma = async(req = request, res = response)=>{
    try {
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const programa = await cambiarEstadoColeccion(Programa, id, 'ocultar');
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'programa ocultado correctamenete', programa});
        }
        return res.json({
            msg: 'programa ocultado correctamenete',
            programa
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const habilitarPrograma = async(req = request, res = response) =>{
    try {
        const tokenNuevo = req.tokenRenovado;
        const {id} = req.params;
        const programa = await cambiarEstadoColeccion(Programa, id, 'habilitar' )
        if(tokenNuevo && tokenNuevo !== null){
            return res.json({tokenNuevo, msg: 'programa habilitado correctamente', programa});
        }
        return res.json({
            msg: 'programa habilitado correctamente',
            programa
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


module.exports = {
    actualizarPrograma,
    crearPrograma,
    eliminarPrograma,
    habilitarPrograma,
    obtenerProgramas,
    obtenerProgramasVista,
    obtenerProgramasId,
    obtenerProgramaIdVista,
    ocultarPrograma,
}