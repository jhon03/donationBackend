const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT, tieneRol, validarImg, existeImg, validarExtencion} = require('../middlewares');
const { subirImgCloud, eliminarImagenCloud, actualizarImagenCloud } = require('../controllers');
const { validarColecciones, validarColeccionesBD, validarexisteImg } = require('../helpers');

const router = new Router();

router.put('/actualizarcloud/:coleccion/:id', [
    validarImg,
    validarExtencion,
    check('id', 'el id debe ser valido').isMongoId(),
    check('id').custom(validarexisteImg),
    check('coleccion').custom( c => validarColeccionesBD( c )),   //validacion colecciones permitadas le mandamos las permitidas como parametro
    validarCampos
],actualizarImagenCloud);


router.post('/cloud/:coleccion/:id', [
    validarExtencion,
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    check('id', 'el id debe ser valido').isMongoId(),
    validarImg,  //middleware personalizado para verificar archivos en la peticion
    validarCampos,
],subirImgCloud);


router.delete('/eliminarcloud/:coleccion/:id', [
    check('id', 'el id debe ser valido').isMongoId(),
    check('id', 'El id de la imagen es requerido').not().isEmpty(),
    check('coleccion').custom( c => validarColeccionesBD( c )),  
    check('id').custom(validarexisteImg),
    validarCampos,
],eliminarImagenCloud);


module.exports = router;