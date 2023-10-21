const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');
const { crearProyecto, actualizarProyecto, eliminarProyecto, obtenerProyectos, obtenerProyectoId } = require('../controllers');

const {validarIdPrograma, validarIdProyecto} = require('../helpers');

const router = new Router();

router.get('/',obtenerProyectos)

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarIdProyecto),
    validarCampos
], obtenerProyectoId);


router.post('/:idPrograma/crear', [
    validarJWT,
    check('idPrograma', 'el id del proyecto no es valido').isMongoId(),
    tieneRol("CREADOR"),
<<<<<<< HEAD
=======
    check('tipoProyecto', 'el tipo de programa es requerido'),
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
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
    validarCampos
], actualizarProyecto)

router.delete('/:id',[
    validarJWT,
    tieneRol('CREADOR'),
    check('id','El id no es valido').isMongoId(),
    validarCampos
],eliminarProyecto)


module.exports = router;