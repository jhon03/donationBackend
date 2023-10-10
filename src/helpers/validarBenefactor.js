const {Benefactor} = require('../Domain/models');

const validarIdBenefactor = async(id) =>{
    const benefactor = await Benefactor.findById(id);
    if(!benefactor || !benefactor.estado){
        throw new Error('El benefactor no existe o esta inactivo -false')
    }
}

const validarIdentificacionBenefactor = async(numeroIdentificacion) =>{
    const benefactor = await Benefactor.findOne({numeroIdentificacion});
    console.log(benefactor);
    if(benefactor && benefactor.estado){
        throw new Error('el numero de identificacion ya esta registrado')
    }
}


module.exports = {
    validarIdBenefactor,
    validarIdentificacionBenefactor,
}