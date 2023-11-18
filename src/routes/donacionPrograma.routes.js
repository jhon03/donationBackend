const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, validarDonacion} = require('../middlewares');  //carpeta donde estan todos los middlewares

const {validarIdPrograma, validarIdDonacionPrograma } = require('../helpers');
const { obtenerDonacionPrograma, crearDonacionPrograma, obtenerDonacionProgramId } = require('../controllers');



const router = Router();


router.get('/', [
    validarJWT,
    validarCampos
] ,obtenerDonacionPrograma); //cuando se busque este endpoint llamara a controlador userget

router.get('/donacion/:id',[
    validarJWT,
    check('id', 'El id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdDonacionPrograma),
    validarCampos
], obtenerDonacionProgramId);



router.post('/programa/:id/crear', [              //arreglo de middlewares para verificar campos
        check('id', 'El id del programa es invalido').isMongoId(),
        check('id', 'El id del programa es requerido').not().isEmpty(),
        check('nombreBenefactor','El nombre es requerido').not().isEmpty(),
        check('tipoIdentificacion', 'el tipo de identificacion es requerido').not().isEmpty(),
        check('numeroIdentificacion', 'El numero de indentificación es requerido').not().isEmpty(),
        check('correo', 'Correo electronico invalido').isEmail(),
        check('correo',' El correo es requerido').not().isEmpty(),
        check('celular', 'El celular es requerido').not().isEmpty(),
        check('celular','El celualr debe ser numerico').isNumeric(),
        check('aporte','El aporte es requerido').not().isEmpty(),
        check('id').custom(validarIdPrograma),
        validarCampos,
        validarDonacion,
],crearDonacionPrograma);




module.exports = router;