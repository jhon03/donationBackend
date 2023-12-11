const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol, validarRole} = require('../middlewares');
const { crearProyecto, actualizarProyecto, eliminarProyecto, obtenerProyectos, obtenerProyectoId, obtenerProyectosVista, obtenerProyectoIdVista, ocultarProyecto, habilitarProyecto } = require('../controllers');
const {validarIdPrograma, validarIdProyecto, validarOpciones} = require('../helpers');

const router = new Router();

//los endpoints de vista son los que se muestra a usuarios no logeados

router.get('/', [
    validarJWT, 
    tieneRol('CREADOR', 'MODIFICADOR'),
] ,obtenerProyectos)

router.get('/vista',obtenerProyectosVista)

router.get('/:id',[
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
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
    check('tipoProyecto', 'el tipo de programa es requerido').not().isEmpty(),
    check('costo', 'el costo del proyecto es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas'),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas').not().isEmpty(),
    check('idPrograma').custom(validarIdPrograma),
    validarCampos,
    validarRole,
],crearProyecto);


router.put('/:id',[
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id', 'el id del proyecto a actualizar no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
    check('opcionesDonacion', 'las opciones de donacion son requeridas').not().isEmpty(),
    check('opcionesDonacion').custom(validarOpciones),
    validarCampos
], actualizarProyecto)

router.get('/habilitar/:id',[
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    validarCampos
],habilitarProyecto)

router.delete('/:id',[
    validarJWT,
    validarRole,
    check('id').custom(validarIdProyecto),
    check('id','El id no es valido').isMongoId(),
    validarCampos
],eliminarProyecto)

router.delete('/ocultar/:id',[
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id').custom(validarIdProyecto),
    check('id','El id no es valido').isMongoId(),
    validarCampos
],ocultarProyecto)


module.exports = router;