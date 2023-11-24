

const validarCampos       = require('./validar.campos');
const validarDonaciones   = require('./validarDonaciones');
const validacionesG       = require('./ValidacionesG.middlewares');
const validarImgs         = require('./validarImg');
const validarJWT          = require('../middlewares/validar-jwt');
const validarJWTDonacion  = require('./validarJwtDonacion'); 
const validarRefreshToken = require('./validarTokenRefresh');
const validarRoles        = require('../middlewares/validar-roles');

//usamos operasor ... (expres) para mandar todo lo que hay en el middleware
module.exports = {
    ...validarCampos,
    ...validarDonaciones,
    ...validacionesG,
    ...validarImgs,
    ...validarJWT,
    ...validarJWTDonacion,
    ...validarRefreshToken,
    ...validarRoles,
}