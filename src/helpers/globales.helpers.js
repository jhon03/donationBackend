
const buscarColeccion = async(modelo, NomRelacion, id=0)=>{
    const coleccion = await modelo.findById(id);
    if(!coleccion){
        throw new Error(`No existe el ${NomRelacion} con este id`);
    }
    return coleccion;
} 

const validarEstadoColeccion = (coleccion, NomRelacion,)=>{
    if(coleccion.estado === 'oculto' || coleccion.estado === 'eliminado'){
        throw new Error(`El ${NomRelacion}, esta oculto o eliminado`);
    }
}

const validarFechaDonacion = (coleccion, NomRelacion,) => {
    const fechaActual = new Date();
    console.log(fechaActual);
    console.log(coleccion.fechaFinalizacion);
    if (coleccion.fechaFinalizacion < fechaActual) {
        throw new Error(`La donación no está permitida, el ${NomRelacion} ha caducado`);
    }
}

module.exports = {
    buscarColeccion,
    validarFechaDonacion,
    validarEstadoColeccion,
}