const {response, request} = require('express');
const bcryptjs = require('bcryptjs');


const validarCorreoCodigo = (req, res) => {
    try {
        
    } catch (error) {
        throw new Error('Error al validar el correo: ' + error.message);
    }
}