const {Router} = require('express');
const { check } = require('express-validator');

const { login, renovarToken} = require('../controllers/auth.controller');

const {validarCampos, validarJWTRefresh} = require('../middlewares')   //importamos todos los middlewares desde del index

const router = new Router();


router.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/renovar-token', [
    validarJWTRefresh,
], renovarToken)

module.exports = router;