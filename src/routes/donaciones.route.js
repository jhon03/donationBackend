const {Router} = require('express');
const { check } = require('express-validator');

const 
{ 
    validarCampos, validarExitsColeccion, validarColeccion, validarJWT
} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { listAllDonaciones, donacionFindById, abrirDonacion, rechazarDonacion, aceptarDonacion } = require('../controllers');


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

router.post('/aceptar/:id',[
    validarJWT,
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es ivalido').isMongoId(),
    validarCampos
], aceptarDonacion);

router.post('/open/:id', [
    validarJWT,
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], abrirDonacion);

router.delete('/rechazar/:id', [
    validarJWT,
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id es invalido').isMongoId(),
    validarCampos
], rechazarDonacion);





module.exports = router;