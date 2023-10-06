const Role = require('../Domain/models/role');
const Colaborador = require('../Domain/models/Colaborador.models');



const validarRol = async(rol = '') =>{        //verificacion personalizada de rol contra la bd
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} que intenta asignar no esta registrado en la base de datos`)
    }
}

const validarEmail = async(correo = '')=>{
    const existeEmail = await Colaborador.findOne({ correo});
    if(existeEmail){
        throw new Error(`el correo: ${correo}, ya esta registrado`)
    }
}

const validarId = async(id) =>{
    const existeColaborador = await Colaborador.findById(id);
    if(!existeColaborador){
        throw new Error(`el id no existe ${id}`)
    }
}

const validarEstado = async(id) =>{
    const colaborador = await Colaborador.findById(id);
    if(!colaborador.estado){
        throw new Error('El colaborador esta inactivo')
    }
}



module.exports = {
    validarRol,
    validarEmail,
    validarId,
    validarEstado
}