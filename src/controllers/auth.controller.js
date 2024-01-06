const { response } = require("express");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Colaborador = require('../Domain/models/Colaborador.models');
const { generarJWT, generarJWTRefresh } = require("../helpers/generate-jwt");
const { Benefactor, TokenR } = require("../Domain/models");
const { validarUsuario, validarContrasenaUsuario, asignarTokenRefresh, expiracionCookie, verificarToken, obtenerToken } = require("../helpers");

const login = async(req, res = response) => {
   
    try {
        const {correo, contrasena} = req.body;      
        const usuario = await validarUsuario(correo);
        validarContrasenaUsuario(usuario, contrasena);

        const token = await generarJWT(usuario.id);   //generar el JWT
        const refreshToken = await generarJWTRefresh(usuario.id);       //genera un token de refresco cada vez que inicia sesion
        asignarTokenRefresh(usuario.id, refreshToken);
        return res.json({
            usuario,
            token,
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al realizar el login ',
            error: error.message
        })
    }

}

const loginCookies = async(req, res = response) => {
    try {
        const {correo, contrasena} = req.body;
        const usuario = await validarUsuario(correo);
        validarContrasenaUsuario(usuario, contrasena); 
        const milisegundosExpiracion = expiracionCookie(200);
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
        const refreshToken = TokenR.findOne({userId: usuario.id});
        if(!refreshToken || refreshToken === null){
            throw new Error('No posees un token de refreco')
        }
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


//dependiendo del front se envia una peticion para validar el token
const validarTokenSesion = (req, res) => {
    try {
        const token = obtenerToken(req);
        if(!token || token === null){
            throw new Error('No hay token en la peticion');
        }
        verificarToken(token, process.env.SECRETORPRIVATEKEY);
        return res.json({
            msg: 'sesion activa token valido'
        })
    } catch (error) {
        return res.status(401).json({
            msg: 'error al validar el token',
            error: error.message
        })
    }
}


//cerrar cesion de usuario por medio de cookie
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
    validarTokenSesion,
}