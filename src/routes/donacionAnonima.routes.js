const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarDonacion} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { validarIdProyecto, validarIdDonacionAno } = require('../helpers');
const { obtenerDonacionAId, obtenerDonacionesAnonimas, crearDonacionAno } = require('../controllers');


const router = Router();


router.get('/', obtenerDonacionesAnonimas); //cuando se busque este endpoint llamara a controlador userget

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id', 'El id es requerido').not().isEmpty(),
    check('id').custom(validarIdDonacionAno),
    validarCampos
], obtenerDonacionAId);



router.post('/:id/crear', [              //arreglo de middlewares para verificar campos
    check('id', 'El id del proyecto es invalido').isMongoId(),
    check('id', 'El id del proyecto es requerido').not().isEmpty(),
    check('nombreBenefactor','El nombre es requerido').not().isEmpty(),
    check('tipoIdentificacion', 'el tipo de identificacion es requerido').not().isEmpty(),
    check('numeroIdentificacion', 'El numero de indentificación es requerido').not().isEmpty(),
    check('correo', 'Correo electronico invalido').isEmail(),
    check('correo',' El correo es requerido').not().isEmpty(),
    check('celular', 'El celular es requerido').not().isEmpty(),
    check('celular','El celualr debe ser numerico').isNumeric(),
    check('aporte','El aporte es requerido').not().isEmpty(),
    check('id').custom(validarIdProyecto),
    validarCampos,
    validarDonacion,
],crearDonacionAno);




module.exports = router;