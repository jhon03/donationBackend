const {Router} = require('express');
const { check } = require('express-validator');

const { login, renovarToken, loginCookies, cerrarCesion, validarTokenSesion} = require('../controllers/auth.controller');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares')   //importamos todos los middlewares desde del index

const router = new Router();

//login con local storage( implementado en app )
router.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

//endpoint para validar sesion del usuario, si esta activa o no
router.get('/validar/Token/Sesion', [
    
], validarTokenSesion);



//prueba login con cookies
// router.post('/login', [
//     check('correo', 'el correo es obligatorio').isEmail(),
//     check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ],loginCookies);

router.post('/renovar-token', [
    validarJWT,
], renovarToken);

//endpoint de cerrar cesion con token en cookies
router.delete('/cerrar/sesion', cerrarCesion)

module.exports = router;