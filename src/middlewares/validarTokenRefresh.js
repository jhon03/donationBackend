const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Colaborador = require('../Domain/models/Colaborador.models');
const { verificarToken } = require('../helpers');


const validarJWTRefresh = async(req= request, res = response, next) => {

    const {Refres_token} = req.body;
    console.log("token de refresco: " + Refres_token);
    if(!Refres_token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })      
    }

    try {       
        const uid = verificarToken(Refres_token, process.env.SECRET_KEY_REFRESH_TOKEN);
        const usuario = await Colaborador.findById(uid); 
        if(!usuario){
            return res.status(401).json({
                msg: 'refresh token no valido -usuario no exite en la db'
            })
        }
  
        if(!usuario.estado){         //verificar usuario activo
            return res.status(401).json({
                msg:'refresh token no valido -usuario inactivo'
            })
        }
         
        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'refresh token no valido',
            error
        })
    }


}


module.exports = {
    validarJWTRefresh
}