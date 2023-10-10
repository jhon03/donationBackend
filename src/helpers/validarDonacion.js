const { DonacionAno } = require("../Domain/models");

const ValidarIdDonacionAno = async (id) =>{
    const donacionano = await DonacionAno.findById(id);
    if(!donacionano  || !donacionano.estado){
        throw new Error('La donacion no existe o esta inactiva -false')
    } 
}

module.exports = {
    ValidarIdDonacionAno,
}