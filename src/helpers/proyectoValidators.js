const { Proyecto } = require("../Domain/models");



const validarIdPrograma = async(id) =>{
    const proyecto = await Proyecto.findById(id);
    if(!proyecto){
        throw new Error('El proyecto no existe')
    }
}


module.exports = {
    validarIdPrograma,
}