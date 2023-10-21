
<<<<<<< HEAD

=======
const validarImgs = require('./validarImg')
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
const validarRoles= require('../middlewares/validar-roles')
const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('./validar.campos');

//usamos operasor ... (expres) para mandar todo lo que hay en el middleware
module.exports = {
    ...validarCampos,
<<<<<<< HEAD
=======
    ...validarImgs,
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
    ...validarJWT,
    ...validarRoles,
}