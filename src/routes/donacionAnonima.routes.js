const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        tieneRol} = require('../middlewares');  //carpeta donde estan todos los middlewares

const { validarRol, validarEmail, validarId, validarEstado, validarIdProyecto, ValidarIdDonacionAno } = require('../helpers');
const { obtenerDonacionAId, obtenerDonacionesAnonimas, crearDonacionAno } = require('../controllers/donacionAnonima.controller');


const router = Router();


router.get('/', obtenerDonacionesAnonimas); //cuando se busque este endpoint llamara a controlador userget

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id', 'El id es requerido').not().isEmpty(),
    check('id').custom(ValidarIdDonacionAno),
    validarCampos
], obtenerDonacionAId);



router.post('/:idProyecto/crear', [              //arreglo de middlewares para verificar campos
        check('idProyecto', 'El id del pryecto es invalido').isMongoId(),
        check('idProyecto', 'El id del proyecto es requerido').not().isEmpty(),
        check('nombreBenefactor','El nombre es requerido').not().isEmpty(),
        check('aporte','El aporte es requerido').not().isEmpty(),
        check('aporte', 'El aporte debe ser un numero').isNumeric(),
        check('idProyecto').custom(validarIdProyecto),
        validarCampos
],crearDonacionAno);




module.exports = router;