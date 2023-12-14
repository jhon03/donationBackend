const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        tieneRol,
        validarRole} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { validarRol, validarEmail, validarId, validarEstado, validarNIdentificacion, validarUsername } = require('../helpers');

const { colaboradorGet, 
        colaboradorDelete, 
        colaboradorPost,
        colaboradorPut,
        verficarCorreoCol,
        colaboradorById
} = require('../controllers');



const router = Router();

//analizar los roles que se necesita para modificar informacon de colaborador
//ademas de mirar bien quien puede hacer que 

router.get('/', [
        validarJWT,
        tieneRol('CREADOR','ADMINISTRADOR', 'MODIFICADOR'),
], colaboradorGet); //cuando se busque este endpoint llamara a controlador userget

router.get('/findById/:id', [
        validarJWT,
        tieneRol('CREADOR','ADMINISTRADOR', 'MODIFICADOR'),
], colaboradorById)

router.put('/:id', [
        validarJWT,
        tieneRol('CREADOR','ADMINISTRADOR', 'MODIFICADOR'),   //middlewarepara verificzr varios roles
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        validarCampos  //llamamos la validacion
],colaboradorPut);


router.delete('/:id', [
        validarJWT,     //middlewar para validar el token
        validarRole,   //middleware para validar el rol creador
        // tieneRol('CREADOR','ADMINISTRADOR'),   //middlewarepara verificzr varios roles
        check('id', 'no es un id valido').isMongoId(),
        check('id').custom( validarId),
        validarCampos
] ,colaboradorDelete);



router.post('/', [              //arreglo de middlewares para verificar campos
        check('nombre', 'el nombre el obligatorio').not().isEmpty(),
        check('username', 'El username es requerido').not().isEmpty(),
        check('tipoIdentificacion', 'el tipo de identificacion es requerido').not().isEmpty(),
        check('numeroIdentificacion', 'el tipo nymero de identificacion es requerido').not().isEmpty(),
        check('contrasena', 'la contrasena es requerida').not().isEmpty(),
        check('cargo', 'El cargo es requerido').not().isEmpty(),
        check('celular', 'El numero de celular es requerido').not().isEmpty(),
        check('contrasena', 'el password deber ser de mas de 6 letras').isLength( {min: 6}),
        check('correo').isEmail().withMessage('Correo no valido'),
        check('correo').custom(validarEmail),   //validacion personalizada
        check('rol').custom( validarRol ),
        check('numeroIdentificacion').custom(validarNIdentificacion),
        check('username').custom(validarUsername),
        validarCampos           //middleware personalizado
],colaboradorPost);

router.post('/verificar/correo', [
        check('correo', 'el correo es requerido').not().isEmpty(),
        check('codigo', 'el codigo es requerido').not().isEmpty(),
        check('correo').isEmail().withMessage('No es una direccion de correo electronico valida'),
        check('correo').custom(validarEmail),
        validarCampos,
], verficarCorreoCol)



module.exports = router;