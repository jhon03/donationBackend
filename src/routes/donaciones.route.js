const {Router} = require('express');
const { check } = require('express-validator');

const 
{ 
    validarCampos, validarExitsColeccion, validarColeccion, validarJWT
} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { listAllDonaciones, donacionFindById, abrirDonacion, rechazarDonacion, aceptarDonacion, enviarCorreo, aceptarDonacionBenefactor, rechazarDonacionBenefactor, aceptarDonacionColaborador, rechazarDonacionColaborador, confirmarDonacionColaborador, formDonacion } = require('../controllers');


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

router.get('/open/:id', [
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], abrirDonacion);

router.get('/formEntrega/:condicion/:id',[
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], formDonacion);


router.post('/enviar/:correoBenefactor', enviarCorreo);





module.exports = router;