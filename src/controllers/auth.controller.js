const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Colaborador = require('../Domain/models/Colaborador.models');
const { generarJWT, generarJWTRefresh } = require("../helpers/generate-jwt");
const { Benefactor, TokenR } = require("../Domain/models");

const login = async(req, res = response) => {

    
    try {
        const {correo, contrasena} = req.body;

        let usuario;
        
        usuario = await Colaborador.findOne({ correo });  //verificar si existe el correo
        if(!usuario){
            usuario = await Benefactor.findOne({correo});
        }

        if(!usuario){
            return res.status(400).json({
                msg: 'usuario y/o contraseña incorrectos -correo'
            })
        }

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'el usuario esta inctivo -estado'
            })
        }

        //verificar la contarseña
        const validarContrasena = bcryptjs.compareSync( contrasena, usuario.contrasena);
        if(!validarContrasena){
            return res.status(400).json({
                msg: 'la contraseña es incorrecta -contraseña'
            })
        }  
        const token = await generarJWT(usuario.id);   //generar el JWT
        const modelRefreshT = await TokenR.findOne({userId: usuario.id});
        console.log(modelRefreshT);
        const refreshToken = await generarJWTRefresh(usuario.id);       //genera un token de refresco cada vez que inicia sesion
        if(!modelRefreshT || modelRefreshT == null ){
            const data = {
                userId: usuario.id,
                tokenRefreso: refreshToken,
            }
            const modelToken = new TokenR(data);
            await modelToken.save();
        } else {
            modelRefreshT.tokenRefreso = refreshToken;
            await modelRefreshT.save();
        }
        return res.json({
            usuario,
            token,
            refreshToken,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'algo salio mal '
        })
    }

}

const loginCookies = async(req, res = response) => {
    try {
        const {correo, contrasena} = req.body;
        const usuario = await Colaborador.findOne({ correo });
        if(!usuario || usuario === null){
            return res.status(400).json({
                msg: 'usuario y/o contraseña incorrectos -correo'
            })
        }
     
        if(!usuario.estado){        //verificar si el usuario esta activo
            return res.status(400).json({
                msg: 'el usuario esta inctivo -estado'
            })
        }
        //verificar la contarseña
        const validarContrasena = bcryptjs.compareSync( contrasena, usuario.contrasena);
        if(!validarContrasena){
            return res.status(400).json({
                msg: 'la contraseña es incorrecta -contraseña'
            })
        }  
        const minutosExpiracion = 60 * 24; // 24 horas
        const milisegundosExpiracion = minutosExpiracion * 60 * 1000;
        const token = await generarJWT(usuario.id);   //generar el JWT}
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: milisegundosExpiracion,
            sameSite: 'None',
        });
        return res.json({
            usuario,
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: "Error al realizar el login",
            error: error.message
        })
    }
}

const renovarToken = async(req, res) =>{
    try {
        const usuario = req.usuario;
        const nuevoTokenAcesso = await generarJWT(usuario.id);
        return res.json({
            msg: 'token renovado con exito',
            token: nuevoTokenAcesso,
        })
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

const cerrarCesion = (req, res=response) =>{
    try {
        res.clearCookie('jwt');
        return res.json({
            msg:'sesión finalizada',
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Ha ocurrido un error: ",
            error: error.message
        })
    }
}


module.exports = {
    cerrarCesion,
    login,
    loginCookies,
    renovarToken,
}