const { Proyecto, Colaborador } = require("../Domain/models");



const validarIdProyecto = async(id) =>{
    const proyecto = await Proyecto.findById(id);
    if(!proyecto || !proyecto.estado){
        throw new Error('El proyecto no existe o esta inactivo -false')
    }
}


module.exports = {
    validarIdProyecto,
}