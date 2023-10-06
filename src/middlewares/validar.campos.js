const { validationResult } = require('express-validator');

const validarCampos = (req, res, next ) =>{

    const error = validationResult(req);  //validacion de errores
    if(!error.isEmpty()){
        return res.status(400).json(error);
    }

    next();
}

module.exports = {
    validarCampos
}