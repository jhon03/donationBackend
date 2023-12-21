const { Colaborador, TokenR } = require("../Domain/models");
const bcryptjs = require('bcryptjs');


const validarUsuario = async (correo = '', id = '') => {
    try {
        let usuario;
        if(id && id !== null){
            usuario = await Colaborador.findById(id);
        } else {
            usuario = await Colaborador.findOne({ correo });  //verificar si existe el correo
        }
        if(!usuario || usuario === null){
            throw new Error(`Usuario inexistente`);
        } else if(!usuario.estado){
            throw new Error(`Usuario inactivo`);
        }
        return usuario;
    } catch (error) {
        throw error;
    }
}

const validarContrasenaUsuario = (usuario, contrasena = '') => {
    try {
        const validarContrasena = bcryptjs.compareSync( contrasena, usuario.contrasena);
        if(!validarContrasena){
            throw new Error(`La contraseña es incorrecta`);
        }  
    } catch (error) {
        throw error;
    }
}

const asignarTokenRefresh = async (userId = '', refreshToken) => {
    try {
        const modelRefreshT = await TokenR.findOne({userId});
        console.log(modelRefreshT);
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
    } catch (error) {
        throw error;
    }
}

const expiracionCookie = (horasDura = 24) => {
    try {
        const minutosExpiracion = 60 * horasDura; // 24 horas
        const milisegundosExpiracion = minutosExpiracion * 60 * 1000;
        return milisegundosExpiracion;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    asignarTokenRefresh,
    expiracionCookie,
    validarUsuario,
    validarContrasenaUsuario,

}