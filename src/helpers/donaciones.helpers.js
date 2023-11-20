const {DonacionAno, DonacionPrograma, DonacionTemporal} = require('../Domain/models');
const { findColeccion, obtenermodeloUrl } = require('./globales.helpers');
const path = require('path');
const fs = require('fs');
const { generarJWT } = require('./generate-jwt');
const crypto = require('crypto');



const obtenerDonaciones = async(modelo, CampoRelacion)=>{
    try {

        const [total, coleccion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
                modelo.countDocuments(),  //devuelve los datos por indice
                modelo.find()
                .populate(CampoRelacion,'nombre')
            //.skip(Number(desde))
            //.limit(Number(limite))
        ]);

        return {total, coleccion};

    } catch (error) {
        throw new Error(`Ha ocurrrido un error al buscar las doanciones ${error.message}`);
    }
}

const listDonaciones = async(pagina = 1, limite = 5)=>{
    try {
        const {total: total1, coleccion: Donacionesprogramas } = await obtenerDonaciones(DonacionPrograma, 'programa');  //primera coleccion(donacion programa)
        const {total: total2, coleccion: Donacionesproyectos } = await obtenerDonaciones(DonacionAno, 'proyecto');       // segunda coleccion (donacion proyecto)
        const listaDonaciones = [...Donacionesprogramas, ...Donacionesproyectos];
        const listaOrdenada = listaDonaciones.sort((a, b) => b.fechaCreacion - a.fechaCreacion );
        const desde = (pagina-1) * limite;
        const hasta = pagina * limite;
        const donacionesPaginacion = listaOrdenada.slice(desde, hasta);
        return {total: listaDonaciones.length, donaciones: donacionesPaginacion};
    } catch (error) {
        throw new Error('ha ocurrido un error al devolver la lista de donaciones ' + error.message);
    }
}

const findByid = (id, donaciones)=>{
    try {
        const donacionEncontrada = donaciones.filter(donacion => donacion._id.toString() === id.toString() );
        console.log(donacionEncontrada);
        if(!donacionEncontrada || donacionEncontrada.length === 0){
            throw new Error(`no se encuebtra donacion con el id: ${id}`);
        }
        return donacionEncontrada[0];
    } catch (error) {
        throw new Error(`ha ocurrido un error al buscar la donacion: ${error.message}`);
    }
}

const modificarDonacion = async(id, condicion = '') => {
    try {
        const {total, donaciones} = await listDonaciones(1, 200000);
        const donacionEncontrada = findByid(id, donaciones);
        const modelo = findColeccion(donacionEncontrada.tipo);
        const donacionAct = await cambiarEstadoDonacion(donacionEncontrada, modelo, condicion);
        return donacionAct;
    } catch (error) {
        throw new Error(error.message);
    }
}

const cambiarEstadoDonacion = async (donacion, modelo, condicion = '') =>{
    try {
        let donacionActualizada = donacion;

        if(donacion.estado === 'rechazada' || donacion.estado === 'terminada'){
            throw new Error(`Ya se resolvio la donacion estado: ${donacion.estado}`);
        }
        if( condicion === 'rechazar'){
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'rechazada');
        }
        if(donacion.estado === 'en proceso' || condicion === 'aceptar'){
           donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'abierta');
        }
        if( condicion === 'recibido'){
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'terminada');
        }
        return donacionActualizada;
    } catch (error) {
        throw new Error(error.message);
    }
}

//sirve pra actualizar cualquier donacion que este dividida por modelo
const updateStateDonacion = async(id, modelo, estado = 'en proceso') =>{
    try {
        const donacionAct = await modelo.findByIdAndUpdate(id, {estado}, {new:true});
        if(donacionAct == null){
            throw new Error('No existe la donacion con el id: ' + id);
        }
        return donacionAct;
    } catch (error) {
        throw new Error(`Error al actualiar la donacion: ${error.message}`);
    }
}


const buscarDonacion = (id=0, donacion)=>{
    try {
        const coleccion = findColeccion(donacion.tipo);
        const donacionEnc = coleccion.findById(id);
        return donacionEnc;
    } catch (error) {
        throw new Error(`La donacion con el id ${id} no existe`);
    }
}

const mapearData = (req)=>{
    try {
        const {id} = req.params;
        const modelo = obtenermodeloUrl(req);
        const data = {                      //generar data aqui estan los datos necesarios para crear un programa
            tipoIdentificacion: req.body.tipoIdentificacion,
            numeroIdentificacion: req.body.numeroIdentificacion,
            nombreBenefactor: req.body.nombreBenefactor,
            correo: req.body.correo,
            celular: req.body.celular,
            aporte: req.body.aporte,   
        }
        if(modelo === 'proyecto'){
            data.proyecto = id;
        } else if(modelo === 'programa'){
            data.programa = id;
        }
        console.log(data.programa + "data")
        return data;
    } catch (error) {
        throw new Error('Error al mapear la data: ' + error.message);
    }
}


module.exports = {
    buscarDonacion,
    cambiarEstadoDonacion,
    findByid,
    listDonaciones,
    mapearData,
    modificarDonacion,
    obtenerDonaciones,
    updateStateDonacion,
}