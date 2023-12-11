const { TokenR } = require("../Domain/models");
const jwt = require('jsonwebtoken');


const obtenerToken = (req) =>{
    const token = req.headers['x-token'];
    return token;
}

const validarExpiracionToken = (expiracion) =>{
    try {
        const ahora = Math.floor(Date.now() / 1000);
        const diferencia = (expiracion - ahora) / 60;
        console.log(`si la diferencia es menor a 10 se renueva el token, diferencia: ${diferencia}`);
        if(diferencia <= 10){
            return true;
        }
        return false;
    } catch (error) {
        throw new Error('error en el proceso de validar el token: ' + error.message);
    }
}

const validarTokenRe = async (uid) => {
    try {
        const modelTokenR = await TokenR.findOne( {userId: uid});
        console.log(modelTokenR);
        if(!modelTokenR || modelTokenR === null || !modelTokenR.tokenRefreso){
            throw new Error('El usuario no tiene un token de refresco');
        }
        jwt.verify(modelTokenR.tokenRefreso, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (error) {
        throw new Error('error al validar el token de refresco : ' + error.message);
    }
}

module.exports = {
    obtenerToken,
    validarExpiracionToken,
    validarTokenRe,
}