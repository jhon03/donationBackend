const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        tieneRol} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { validarRol, validarEmail, validarId, validarEstado } = require('../helpers');
const { obtenerDonaciones, obtenerDonacionId, eliminarDonacion, crearDonacion, actualizarDonacion } = require('../controllers/donacion.controller');


const router = Router();


router.get('/', obtenerDonaciones); //cuando se busque este endpoint llamara a controlador userget

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarCampos
], obtenerDonacionId);


router.put('/:id', [
        validarJWT,
        tieneRol('CREADOR','ADMINISTRADOR'),
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        check('id').custom(validarEstado),
        validarCampos  //llamamos la validacion
],actualizarDonacion);


router.delete('/:id', [
        validarJWT,     //middlewar para validar el token
        //validarRole,   middleware para validar el rol
        tieneRol('CREADOR','ADMINISTRADOR'),   //middlewarepara verificzr varios roles
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        validarCampos
] ,eliminarDonacion);



router.post('/:idProyecto', [              //arreglo de middlewares para verificar campos
        validarJWT,        //middleware personalizado
        tieneRol('BENEFACTOR'),
        validarCampos
],crearDonacion);




module.exports = router;