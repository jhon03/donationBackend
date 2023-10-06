const { request, response } = require("express");


const validarRole = (req= request, res= response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'se quiere verificar el rol sin verificar el token'
        });
    }

    const {rol, nombre} = req.usuario;
    if(rol !== 'CREADOR'){
        return res.status(401).json({
            msg: `${nombre} no tienes permiso para hacer esto -rol`
        });
    }

    next();
}

//... nos sirve para recibir varios argumentos en un arreglo
tieneRol = (...roles) =>{

    return (req, res = response, next) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin verificar el token'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles ${roles} y tu eres ${req.usuario.rol}`
            })
        }
    

        next();

    }
}



module.exports = {
    validarRole,
    tieneRol
}