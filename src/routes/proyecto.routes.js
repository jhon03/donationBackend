const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');
const { crearProyecto, actualizarProyecto, eliminarProyecto, obtenerProyectos, obtenerProyectoId, obtenerProyectosVista, obtenerProyectoIdVista, ocultarProyecto, habilitarProyecto } = require('../controllers');
const {validarIdPrograma, validarIdProyecto, validarOpciones} = require('../helpers');

const router = new Router();

router.get('/', validarJWT ,obtenerProyectos)

router.get('/vista',obtenerProyectosVista)

router.get('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    validarCampos
], obtenerProyectoId);

router.get('/vista/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    validarCampos
], obtenerProyectoIdVista);


router.post('/:idPrograma/crear', [
    validarJWT,
    check('idPrograma', 'el id del proyecto no es valido').isMongoId(),
    tieneRol("CREADOR"),
    check('tipoProyecto', 'el tipo de programa es requerido').not().isEmpty(),
    check('costo', 'el costo del proyecto es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas'),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas').not().isEmpty(),
    check('idPrograma').custom(validarIdPrograma),
    validarCampos
],crearProyecto);


router.put('/:id',[
    validarJWT,
    check('id', 'el id del proyecto a actualizar no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas').not().isEmpty(),
    validarCampos
], actualizarProyecto)

router.get('/habilitar/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    tieneRol('CREADOR'),
    validarCampos
],habilitarProyecto)

router.delete('/:id',[
    validarJWT,
    check('id').custom(validarIdProyecto),
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    validarCampos
],eliminarProyecto)

router.delete('/ocultar/:id',[
    validarJWT,
    check('id').custom(validarIdProyecto),
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    validarCampos
],ocultarProyecto)


module.exports = router;