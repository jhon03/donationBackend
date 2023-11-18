const {Programa} = require('../Domain/models');

const validarIdPrograma = async(id) =>{
    try {
        const programa = await Programa.findById(id);
        if(!programa || programa.estado === 'eliminado'){
            throw new Error('El programa no existe o esta eliminado -estado')
        }
    } catch (error) {
        throw new Error(error.message);
    }    
}

module.exports = {
    validarIdPrograma
}