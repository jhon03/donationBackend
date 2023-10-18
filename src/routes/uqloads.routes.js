const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol, validarImg} = require('../middlewares');
const { subirImg, actualizarImg, obtenerImg, subirImgCloud, eliminarImagenCloud } = require('../controllers');
const { validarColecciones, validarColeccionesBD } = require('../helpers');

const router = new Router();

router.get('/:coleccion/:id',[
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )),
    validarCampos
], obtenerImg)


router.post('/crear/:coleccion/:id', [
    validarImg,  //middleware personalizado para verificar archivos en la peticion
    validarCampos,
],subirImg);

router.put('/actualizar/:coleccion/:id', [
    validarImg,
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )),   //validacion colecciones permitadas le mandamos las permitidas como parametro
    validarCampos
],actualizarImg);


router.post('/cloud/:coleccion/:id', [
    validarImg,  //middleware personalizado para verificar archivos en la peticion
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    validarCampos,
],subirImgCloud);


router.delete('/eliminarcloud/:coleccion/:id', [
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    validarCampos,
],eliminarImagenCloud);


module.exports = router;