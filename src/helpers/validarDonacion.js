const { DonacionAno, DonacionPrograma } = require("../Domain/models");

const validarIdDonacionAno = async (id) =>{
    const donacionano = await DonacionAno.findById(id);
    if(!donacionano  || !donacionano.estado){
        throw new Error('La donacion no existe o esta inactiva -false')
    } 
}

const validarIdDonacionPrograma = async (value) =>{
    const donacionPrograma = await DonacionPrograma.findById(value);
    if(!donacionPrograma){
        throw new Error('La donacion no existe')
    } 
}





module.exports = {
    validarIdDonacionAno,
    validarIdDonacionPrograma
}