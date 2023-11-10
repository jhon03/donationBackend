const {Programa} = require('../Domain/models');

const validarIdPrograma = async(id) =>{
    const programa = await Programa.findById(id);
    if(!programa || programa.estado === 'eliminado'){
        throw new Error('El programa no existe o esta eliminado -estado')
    }
}

module.exports = {
    validarIdPrograma
}