
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { listDonaciones, findByid, verificarToken } = require('../helpers');

const validarJWTDonacion = async (req=request, res= response, next) =>{
    try {
        const token = req.header('Dona-token')
        console.log("token" + token);
        if(!token){
            return res.status(401).json({
                msg: 'no hay token en la peticion'
            })
        }

        const uid = verificarToken(token, process.env.SECRETORPRIVATEKEY);
        const {total, donaciones} = await listDonaciones(1, 2000);
        const donacionEncontrada = findByid(uid, donaciones);
        if(!donacionEncontrada || donacionEncontrada.estado != 'abierta'){
            throw new Error(`No existe la donacion o no puedes modificar su estado: ${donacionEncontrada.estado}`);
        }

        req.donacion = donacionEncontrada;
        next();
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    validarJWTDonacion,
}