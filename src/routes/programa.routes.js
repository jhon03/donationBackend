const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');   //importamos todos los middlewares desde del index

const { crearPrograma, obtenerProgramas, actualizarPrograma, eliminarPrograma, obtenerProgramasId } = require('../controllers/programa.controller');
const { validarIdPrograma } = require('../helpers');

const router = new Router();


router.get('/',obtenerProgramas)

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
], obtenerProgramasId)

router.post('/crear', [
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('eslogan', 'El eslogan es requerido').not().isEmpty(),
    check('usuCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('usuModificador', 'El usuario modificador es requerido').not().isEmpty(),
    validarCampos
],crearPrograma);

router.put('/:id',[
    validarJWT,
    check('id', 'el id del programa a actualizar no es valido').isMongoId(),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('eslogan', 'El eslogan es requerido').not().isEmpty(),
    check('usuCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('usuModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('id').custom(validarIdPrograma),
    validarCampos
], actualizarPrograma)

router.delete('/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
],eliminarPrograma)




module.exports = router;