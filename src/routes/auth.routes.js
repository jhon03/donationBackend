const {Router} = require('express');
const { check } = require('express-validator');

const { login, renovarToken, loginCookies, cerrarCesion} = require('../controllers/auth.controller');

const {validarCampos, validarJWTRefresh} = require('../middlewares')   //importamos todos los middlewares desde del index

const router = new Router();

//login con local storage( implementado en app )
router.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

//prueba login con cookies
// router.post('/login', [
//     check('correo', 'el correo es obligatorio').isEmail(),
//     check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ],loginCookies);

router.post('/renovar-token', [
    validarJWTRefresh,
], renovarToken);

router.delete('/cerrar/sesion', cerrarCesion)

module.exports = router;