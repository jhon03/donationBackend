const { response, request} = require('express');   //modulo para tipear respuesta


const {Programa} = require('../Domain/models');
const { validarOpciones, buscarProgramas, buscarProgramaId, crearObjetoPrograma, cambiarEstado } = require('../helpers');



const obtenerProgramas = async(req = request, res = response) => {
    try {
        
        const {page = 1, limite = 5} = req.query;
        const desde = (page-1) * limite;

        const {total, programas} = await buscarProgramas(req, false, Number(limite), Number(desde));
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
        
        const {total, programas} = await buscarProgramas(req, vista=true, Number(limite), Number(desde));
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
        const programa = await buscarProgramaId(req);
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
        const programa = await buscarProgramaId(req, vista = true);
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
        const programa = await Programa.findByIdAndUpdate(id, {estado:'eliminado'}, {new:true} );
        res.json({
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
           
        const {data, nombre} = crearObjetoPrograma(req);        //generar data aqui estan los datos necesarios para crear un programa
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
        await programa.save();  //guardar en la base de datos

        res.status(201).json(programa);

    } catch (error) {
        mag: 'error al crear el programa'
        res.status(400).json({
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
        res.status(400).json({
            error: error.message
        })
    }
    
}

const ocultarPrograma = async(req = request, res = response)=>{
    try {
        const programa = await cambiarEstado(req, Programa, vista=true);
        res.json({
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
        const programa = await cambiarEstado(req, Programa, false ,habilitar=true)
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