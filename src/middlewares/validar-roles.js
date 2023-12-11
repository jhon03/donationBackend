const { request, response } = require("express");
const { Role } = require("../Domain/models");

//middleware de validacion de rol contra la base de datos
const validarRole = async (req= request, res= response, next) => {
    try {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin verificar el token'
            });
        }
    
        const {rol, nombre} = req.usuario;
        const role = await Role.findById(rol);
        console.log(role.rol);
        if(role.rol !== 'CREADOR' || role === null){
            return res.status(401).json({
                msg: `${nombre} no tienes permiso para hacer esto -rol`
            });
        }
    
        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'error al validar el rol',
            error: error.message,
        })
    }
   
}

//... nos sirve para recibir varios argumentos en un arreglo
tieneRol = (...roles) =>{
    try {
        return async (req, res = response, next) =>{
            if(!req.usuario){
                return res.status(500).json({
                    msg: 'se quiere verificar el rol sin verificar el token'
                });
            }
    
            const rol = await Role.findById(req.usuario.rol);
            console.log('usted tiene el rol de: ' + rol.rol);
            if(!roles.includes(rol.rol) || rol === null){
                return res.status(401).json({
                    msg: `el servicio requiere uno de estos roles ${roles} y tu eres ${rol.rol}`
                })
            }    
            next();
    
        } 
    } catch (error) {
        return res.status(400).json({
            msg: 'error al validar el rol',
            error: error.message
        })
    }
    
}



module.exports = {
    validarRole,
    tieneRol
}