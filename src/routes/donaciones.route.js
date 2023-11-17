const {Router} = require('express');
const { check } = require('express-validator');

const 
{ 
    validarCampos, validarExitsColeccion, validarColeccion, validarJWT, validarJWTDonacion
} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { listAllDonaciones, donacionFindById, abrirDonacion, rechazarDonacion, aceptarDonacion, enviarCorreo, aceptarDonacionBenefactor, rechazarDonacionBenefactor, aceptarDonacionColaborador, rechazarDonacionColaborador, confirmarDonacionColaborador, formDonacion, donacionBenefactor, verificarCorreoDona, verificarCorreoDonaciones, enviarCorreoElectronico } = require('../controllers');


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

router.delete('/rechazar/:id',[
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], rechazarDonacionColaborador);

router.post('/open/:id', [
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

router.post('/verificar/correo/donacion',[

],verificarCorreoDonaciones );


router.post('/enviar/:correoBenefactor', enviarCorreoElectronico);





module.exports = router;