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

router.post('/confirmar/:id',[
    validarJWT,
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], confirmarDonacionColaborador);

router.put('/rechazar/:id',[
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], rechazarDonacionColaborador);

router.get('/open/:id', [
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], abrirDonacion);


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