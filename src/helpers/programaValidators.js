const {Programa} = require('../Domain/models');

const validarIdPrograma = async(id) =>{
    const programa = await Programa.findById(id);
    if(!programa){
        throw new Error('El programa no existe')
    }
}


module.exports = {
    validarIdPrograma
}