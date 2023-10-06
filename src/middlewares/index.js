

const validarRoles= require('../middlewares/validar-roles')
const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('./validar.campos');

//usamos operasor ... (expres) para mandar todo lo que hay en el middleware
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
}