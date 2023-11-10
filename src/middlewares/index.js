

const validarCampos     = require('./validar.campos');
const validarDonaciones = require('./validarDonaciones')
const validarImgs       = require('./validarImg')
const validarJWT        = require('../middlewares/validar-jwt');
const validarRoles      = require('../middlewares/validar-roles')

//usamos operasor ... (expres) para mandar todo lo que hay en el middleware
module.exports = {
    ...validarCampos,
    ...validarDonaciones,
    ...validarImgs,
    ...validarJWT,
    ...validarRoles,
}