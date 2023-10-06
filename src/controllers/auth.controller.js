const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Colaborador = require('../Domain/models/Colaborador.models');
const { generarJWT } = require("../helpers/generate-jwt");

const login = async(req, res = response) => {

    const {correo, contrasena} = req.body;

    try {
        //verificar si existe el correo
        const colaborador = await Colaborador.findOne({ correo });
        if(!colaborador){
            return res.status(400).json({
                msg: 'usuario y/o contraseña incorrectos -correo'
            })
        }

        //verificar si el usuario esta activo
        if(!colaborador.estado){
            return res.status(400).json({
                msg: 'el usuario esta inctivo -estado'
            })
        }

        //verificar la contarseña
        const validarContrasena = bcryptjs.compareSync( contrasena, colaborador.contrasena);
        if(!validarContrasena){
            return res.status(400).json({
                msg: 'la contraseña es incorrecta -contraseña'
            })
        }

        //generar el JWT
        const token = await generarJWT(colaborador.id);


        res.json({
            colaborador,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'algo salio mal '
        })
    }

}


module.exports = {
    login
}