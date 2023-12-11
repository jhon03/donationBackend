const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Colaborador = require('../Domain/models/Colaborador.models');
const { Benefactor } = require('../Domain/models');
const { validarExpiracionToken, validarTokenRe, generarJWT } = require('../helpers');

const validarJWT = async(req= request, res = response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {       
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const tokenDecoded = jwt.decode(token);
        if(validarExpiracionToken(tokenDecoded.exp) ){
            await validarTokenRe(uid);
            const tokenAcessoRenovado = await generarJWT(uid);
            req.tokenRenovado = tokenAcessoRenovado;
        }

        let usuario;

        usuario = await Colaborador.findById(uid);
        if(!usuario){
            usuario = await Benefactor.findById(uid);
        }

        if(!usuario){
            return res.status(401).json({
                msg: 'token no valido -usuario no exite en la db'
            })
        }

        //verificar usuario activo
        if(!usuario.estado){
            return res.status(401).json({
                msg:'token no valido -usuario inactivo'
            })
        }
         
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
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Colaborador.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg: 'token no valido -usuario no exite en la db'
            })
        }     
        if(!usuario.estado){            //verificar usuario activo
            return res.status(401).json({
                msg:'token no valido -usuario inactivo'
            })
        }
         
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