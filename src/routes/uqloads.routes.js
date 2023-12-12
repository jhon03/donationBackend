const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, validarImg, validarExtencion} = require('../middlewares');
const { subirImgCloud, eliminarImagenCloud, actualizarImagenCloud, obtenerImagenes, obtenerImagenId, deleteAllImg } = require('../controllers');
const { validarColeccionesBD, validarexisteImg } = require('../helpers');

const router = new Router();

router.get('/imagenes',[
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
], obtenerImagenes);

router.get('/imagenes/:id', [
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarexisteImg),
    validarCampos
], obtenerImagenId)

router.put('/actualizar/:coleccion/:id', [
    validarJWT,
    validarImg,
    validarExtencion,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id', 'el id debe ser valido').isMongoId(),
    check('id').custom(validarexisteImg),
    check('coleccion').custom( c => validarColeccionesBD( c )),   //validacion colecciones permitadas le mandamos las permitidas como parametro
    validarCampos
],actualizarImagenCloud);


router.post('/crear/:coleccion/:id', [
    validarJWT,
    validarImg,  //middleware personalizado para verificar archivos en la peticion
    validarExtencion,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    check('id', 'el id debe ser valido').isMongoId(),
    validarCampos,
],subirImgCloud);


router.delete('/eliminar/:coleccion/:id', [
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id', 'el id debe ser valido').isMongoId(),
    check('id', 'El id de la imagen es requerido').not().isEmpty(),
    check('coleccion').custom( c => validarColeccionesBD( c )),  
    check('id').custom(validarexisteImg),
    validarCampos,
],eliminarImagenCloud);

router.delete('/eliminarAll/:coleccion/:id', [
    validarJWT,
    tieneRol('CREADOR', 'MODIFICADOR'),
    check('id', 'el id debe ser valido').isMongoId(),
    check('id', 'El id de la imagen es requerido').not().isEmpty(),
    validarCampos,
], deleteAllImg);


module.exports = router;