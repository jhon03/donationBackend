const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Colaborador = require('../Domain/models/Colaborador.models')

const validarJWT = async(req= request, res = response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const colaborador = await Colaborador.findById(uid);
        if(!colaborador){
            return res.status(401).json({
                msg: 'token no valido -usuario no exite en la db'
            })
        }

        //verificar usuario activo
        if(!colaborador.estado){
            return res.status(401).json({
                msg:'token no valido -usuario inactivo'
            })
        }
         
        req.usuario = colaborador;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'token no valido'
        })
    }


}


module.exports = {
    validarJWT
}