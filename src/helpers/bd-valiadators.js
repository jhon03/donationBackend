

const {Role, Colaborador} = require('../Domain/models')



const validarRol = async(rol = '') =>{        //verificacion personalizada de rol contra la bd
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} que intenta asignar no esta registrado en la base de datos`)
    }
}

const validarEmail = async(correo = '')=>{
    const colaborador = await Colaborador.findOne({ correo});
    if(colaborador && colaborador.estado ){
        throw new Error(`el correo: ${correo}, ya esta registrado`)
    }
}

const validarId = async(id) =>{
    const existeColaborador = await Colaborador.findById(id);
    if(!existeColaborador || !existeColaborador.estado){
        throw new Error(`el id no existe ${id} o esta inactivo`)
    }
}

const validarNIdentificacion = async(numeroIdentificacion) =>{
    const colaborador = await Colaborador.findOne({numeroIdentificacion});
    if(colaborador && colaborador.estado){
        throw  new Error('ya se encuentra un usuario registrado con este numero identificación');
    }
}

const validarUsername = async(username) =>{
    const usuario = await Colaborador.findOne({username});
    if(usuario && usuario.estado){
        throw new Error(`ya hay un usuario con el username ${username}`)
    }
}



module.exports = {
    validarRol,
    validarEmail,
    validarId,
    validarNIdentificacion,
    validarUsername
}