const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, validarJWT} = require('../middlewares');   //importamos todos los middlewares desde del index

const { programaPost, programaGet, programaPut, programaDelete, programaGetId } = require('../controllers/programa.controller');

const router = new Router();


router.get('/',[
    validarCampos
],programaGet)

router.get('/:id',[
    validarCampos
], programaGetId)

router.post('/crear', [
    validarJWT,
    check('nombre', 'el nombre es requerido').not().isEmpty(),
    validarCampos
],programaPost);

router.put('/:id',[
    validarCampos
], programaPut)

router.delete('/:id',[
    validarCampos
],programaDelete)




module.exports = router;