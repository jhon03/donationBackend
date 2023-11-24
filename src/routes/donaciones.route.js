const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, validarJWTDonacion} = require('../middlewares');  //carpeta donde estan todos los middlewares
const { listAllDonaciones, donacionFindById, abrirDonacion,  rechazarDonacionColaborador, confirmarDonacionColaborador, formDonacion, donacionBenefactor, verificarCorreoDonaciones, correoRecibido, enviarCorreoPr} = require('../controllers');


const router = Router();

router.get('/', [
    validarJWT,
    validarCampos
] ,listAllDonaciones); //cuando se busque este endpoint llamara a controlador userget

router.get('/:id',[
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], donacionFindById);

router.get('/confirmar/:id',[
    validarJWT,
    check('id', 'El id de la donacion es requerido').not().isEmpty(),
    check('id', 'El id de la donacion es invalido').isMongoId(),
    check('detalles', 'Los detalles de la donacion son requeridos').not().isEmpty(),
    validarCampos
], confirmarDonacionColaborador);

router.put('/rechazar/:id',[
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    check('mensaje','El mensaje de motivo es requerido').not().isEmpty(),
    validarCampos
], rechazarDonacionColaborador);

router.get('/open/:id', [
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], abrirDonacion);

//respuesta al formulario de oparte del benefactor con token
router.post('/formEntrega/:condicion/:token/:id',[
    validarJWTDonacion,
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], formDonacion);

router.post('/formEntrega/:condicion',[
    validarJWTDonacion,
    check('condicion', 'La condicion es requerida').not().isEmpty(),
    validarCampos
], formDonacion);

router.get('/InfoDonacion/benefactor',[
    validarJWTDonacion
],donacionBenefactor);

router.post('/verificar/correo/donacion',[],verificarCorreoDonaciones );

//endpoint denacion recibida
router.get('/correo/recibido/:id', [
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], correoRecibido);

router.post('/enviar/correo/:correo', []
, enviarCorreoPr);


module.exports = router;