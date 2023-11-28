const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');   //importamos todos los middlewares desde del index

const { crearPrograma, obtenerProgramas, actualizarPrograma, eliminarPrograma, obtenerProgramasId, obtenerProgramasVista, obtenerProgramaIdVista, ocultarPrograma, habilitarPrograma } = require('../controllers');
const { validarIdPrograma, validarOpciones } = require('../helpers');

const router = new Router();


router.get('/', validarJWT ,obtenerProgramas)

router.get('/vista', obtenerProgramasVista)

router.get('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
], obtenerProgramasId)

router.get('/vista/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
], obtenerProgramaIdVista)

router.post('/crear', [
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('eslogan', 'El eslogan es requerido').not().isEmpty(),
    check('usuCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('usuModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesColaboracion', 'la opciones de colaboracion son requeridas').not().isEmpty(),
    validarCampos
],crearPrograma);

router.put('/actualizar/:id',[
    validarJWT,
    check('id', 'el id del programa a actualizar no es valido').isMongoId(),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('eslogan', 'El eslogan es requerido').not().isEmpty(),
    check('usuCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('usuModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesColaboracion', 'la opciones de colaboracion son requeridas').not().isEmpty(),
    check('id').custom(validarIdPrograma),
    validarCampos
], actualizarPrograma)

router.delete('/eliminar/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
],eliminarPrograma)

router.delete('/ocultar/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
],ocultarPrograma)

router.get('/habilitar/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdPrograma),
    validarCampos
],habilitarPrograma)








module.exports = router;