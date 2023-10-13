const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');

const {obtenerBenefactorId, obtenerBenefactores, crearBenefactor, eliminarBenefactor, actualizarBenefactor} =require('../controllers/benefactor.controller');
const { validarIdBenefactor, validarIdentificacionBenefactor } = require('../helpers');

const router = new Router();

router.get('/',obtenerBenefactores)

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdBenefactor),
    validarCampos
], obtenerBenefactorId);


router.post('/crear', [
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('correo', 'El correo es requerido').not().isEmpty(),
    check('correo', 'el correo no es valido').isEmail(),
    check('celular', 'el celular es requerido').not().isEmpty(),
    check('numeroIdentificacion','el numero de identificacion es requerido').not().isEmpty(),
    check('contrasena', 'La contraseña es requerida').not().isEmpty(),
    check('numeroIdentificacion').custom(validarIdentificacionBenefactor),
    validarCampos
],crearBenefactor);


router.put('/:id',[
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    validarCampos
], actualizarBenefactor)

router.delete('/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),   
    validarCampos
],eliminarBenefactor)


module.exports = router;