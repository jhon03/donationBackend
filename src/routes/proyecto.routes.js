const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol} = require('../middlewares');
const { crearProyecto, actualizarProyecto, eliminarProyecto, obtenerProyectos, obtenerProyectoId } = require('../controllers/proyecto.controller');

const router = new Router();

router.get('/',obtenerProyectos)

router.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    validarCampos
], obtenerProyectoId);


router.post('/:idPrograma/crear', [
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    check('colCreador', 'El usuario creador es requerido').not().isEmpty(),
    check('colModificador', 'El usuario modificador es requerido').not().isEmpty(),
    validarCampos
],crearProyecto);


router.put('/:id',[
    validarJWT,
    check('id', 'el id del proyecto a actualizar no es valido').isMongoId(),
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