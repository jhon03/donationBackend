const {Router} = require('express');
const { check } = require('express-validator');

const { 
        validarCampos,
        validarJWT,
        tieneRol
 } = require('../middlewares');  //carpeta donde estan todos los middlewares

 const { validarRol, validarEmail, validarId, validarEstado } = require('../helpers/bd-valiadators');

const { colaboradorGet, 
        colaboradorDelete, 
        colaboradorPatch,
        colaboradorPost,
        colaboradorPut
} = require('../controllers/colaborador.controllers');



const router = Router();


router.get('/', colaboradorGet); //cuando se busque este endpoint llamara a controlador userget

router.put('/:id', [
        validarJWT,
        tieneRol('CREADOR','ADMINISTRADOR'),
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        check('id').custom(validarEstado),
        validarCampos  //llamamos la validacion
],colaboradorPut);


router.delete('/:id', [
        validarJWT,     //middlewar para validar el token
        //validarRole,   middleware para validar el rol
        tieneRol('CREADOR','ADMINISTRADOR'),   //middlewarepara verificzr varios roles
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        validarCampos
] ,colaboradorDelete);



router.post('/', [              //arreglo de middlewares para verificar campos
        check('nombre', 'el nombre el obligatorio').not().isEmpty(),
        check('contrasena', 'el password deber ser de mas de 6 letras').isLength( {min: 6}),
        check('correo','el corrreo no es valido').isEmail(),
        check('correo','el correo no esta registrado').custom(validarEmail),   //validacion personalizada
        check('rol').custom( validarRol ),
        validarCampos           //middleware personalizado
],colaboradorPost);


router.patch('/', colaboradorPatch);


module.exports = router;