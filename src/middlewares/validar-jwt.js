const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Colaborador = require('../Domain/models/Colaborador.models');
const { Benefactor } = require('../Domain/models');
const { validarExpiracionToken, validarTokenRe, generarJWT, verificarToken, obtenerToken, validarUsuario } = require('../helpers');

const validarJWT = async(req= request, res = response, next) => {

    const token = obtenerToken(req);
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {       
        const uid = verificarToken(token, process.env.SECRETORPRIVATEKEY);
        const tokenDecoded = jwt.decode(token);
        if(validarExpiracionToken(tokenDecoded.exp) ){
            await validarTokenRe(uid);
            const tokenAcessoRenovado = await generarJWT(uid);
            req.tokenRenovado = tokenAcessoRenovado;
        }

        const usuario = await validarUsuario('', uid)        
        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'token no valido',
            error: error.message
        })
    }


}

const validarJWTCookie = async(req= request, res = response, next) => {

    const token = req.cookies.jwt;
    console.log(token);
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {       
        const uid = verificarToken(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await validarUsuario('', uid);        
        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'token no valido',
            error
        })
    }


}


module.exports = {
    validarJWT,
    validarJWTCookie,
}