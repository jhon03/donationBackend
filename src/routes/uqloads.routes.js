const {Router} = require('express');
const { check } = require('express-validator');

<<<<<<< HEAD
const {validarCampos, validarJWT, tieneRol, validarImg} = require('../middlewares');
const { subirImg, actualizarImg, obtenerImg, subirImgCloud, eliminarImagenCloud } = require('../controllers');
const { validarColecciones, validarColeccionesBD } = require('../helpers');

const router = new Router();

router.get('/:coleccion/:id',[
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )),
    validarCampos
], obtenerImg)
=======
const {validarCampos, validarJWT, validarImg, validarExtencion} = require('../middlewares');
const { subirImgCloud, eliminarImagenCloud, actualizarImagenCloud, obtenerImagenes, obtenerImagenId, deleteAllImg } = require('../controllers');
const { validarColeccionesBD, validarexisteImg } = require('../helpers');

const router = new Router();

router.get('/imagenes',[

], obtenerImagenes);

router.get('/imagenes/:id', [
    check('id', 'el id es requerido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(validarexisteImg),
    validarCampos
], obtenerImagenId)

router.put('/actualizar/:coleccion/:id', [
    validarImg,
    validarExtencion,
    check('id', 'el id debe ser valido').isMongoId(),
    check('id').custom(validarexisteImg),
    check('coleccion').custom( c => validarColeccionesBD( c )),   //validacion colecciones permitadas le mandamos las permitidas como parametro
    validarCampos
],actualizarImagenCloud);
>>>>>>> copia


router.post('/crear/:coleccion/:id', [
    validarImg,  //middleware personalizado para verificar archivos en la peticion
<<<<<<< HEAD
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
=======
    validarExtencion,
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    check('id', 'el id debe ser valido').isMongoId(),
>>>>>>> copia
    validarCampos,
],subirImgCloud);


<<<<<<< HEAD
router.delete('/eliminarcloud/:coleccion/:id', [
    check('id', 'el id debe ser valido').isMongoId(),
    check('coleccion').custom( c => validarColeccionesBD( c )), 
    validarCampos,
],eliminarImagenCloud);

=======
router.delete('/eliminar/:coleccion/:id', [
    check('id', 'el id debe ser valido').isMongoId(),
    check('id', 'El id de la imagen es requerido').not().isEmpty(),
    check('coleccion').custom( c => validarColeccionesBD( c )),  
    check('id').custom(validarexisteImg),
    validarCampos,
],eliminarImagenCloud);

router.delete('/eliminarAll/:coleccion/:id', [
    check('id', 'el id debe ser valido').isMongoId(),
    check('id', 'El id de la imagen es requerido').not().isEmpty(),
    validarCampos,
], deleteAllImg);

>>>>>>> copia

module.exports = router;