const {DonacionAno, DonacionPrograma} = require('../Domain/models');
const { findColeccion } = require('./globales.helpers');

const listDonaciones = async(pagina = 1, limite = 5)=>{
    try {
        const {total: total1, coleccion: Donacionesprogramas } = await obtenerDonaciones(DonacionPrograma, 'programa');  //primera coleccion(donacion programa)
        const {total: total2, coleccion: Donacionesproyectos } = await obtenerDonaciones(DonacionAno, 'proyecto');       // segunda coleccion (donacion proyecto)
        const listaDonaciones = [...Donacionesprogramas, ...Donacionesproyectos];
        const desde = (pagina-1) * limite;
        const hasta = pagina * limite;
        const donacionesPaginacion = listaDonaciones.slice(desde, hasta);
        return {total: listaDonaciones.length, donaciones: donacionesPaginacion};
    } catch (error) {
        throw new Error('ha ocurrido un error al devolver la lista de donaciones ' + error.message);
    }
}

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

const modificarDonacion = async(id= 0,aceptar=false, rechazar=false) => {
    try {
        const {total, donaciones} = await listDonaciones(1, 2000);
        const donacionEncontrada = findByid(id, donaciones);
        const modelo = findColeccion(donacionEncontrada.tipo);
        console.log(modelo);
        const donacionAct = await cambiarEstadoDonacion(donacionEncontrada, modelo, aceptar, rechazar);
        console.log(`docnacion desde helper: ${donacionAct}`);
        return donacionAct;
    } catch (error) {
        throw new Error(error.message);
    }
}

const cambiarEstadoDonacion = async (donacion, modelo, aceptar =false, rechazar=false) =>{
    try {
        let donacionActualizada = donacion;

        if(aceptar){
            if(donacion.estado === 'rechazada'){
                throw new Error(`ya haz rechazado la donacion`);
            }
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'terminada');
        }
        if(rechazar){
            if(donacion.estado === 'terminada'){
                throw new Error(`No puedes rechazar una donacion terminada`);
            }
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'rechazada');
        }
        if(donacion.estado === 'en proceso'){
           donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'abierta');
        }
        return donacionActualizada;
    } catch (error) {
        throw new Error(error.message);
    }
}

//sirve pra actualizar cualquier donacion que este dividida por modelo
const updateStateDonacion = async(id, modelo, estado = 'abierta') =>{
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

module.exports = {
    buscarDonacion,
    cambiarEstadoDonacion,
    findByid,
    listDonaciones,
    modificarDonacion,
    obtenerDonaciones,
    updateStateDonacion,

}