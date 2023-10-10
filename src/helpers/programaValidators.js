const {Programa} = require('../Domain/models');

const validarIdPrograma = async(id) =>{
    const programa = await Programa.findById(id);
    if(!programa || !programa.estado){
        throw new Error('El programa no existe o esta inactivo -false')
    }
}

module.exports = {
    validarIdPrograma
}