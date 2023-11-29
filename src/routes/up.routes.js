const {Router} = require('express');
const { check } = require('express-validator');


const router = new Router();

router.get('/',obtenerBenefactores)

//endpoint de prueba para validar(servicios de verificación)
router.get('/up', (req, res) => {
    
    const response = {message: "Hola app"};
    res.json(response);
});


module.exports = router;

