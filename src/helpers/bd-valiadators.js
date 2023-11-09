

const { default: mongoose } = require('mongoose');
const {Role, Colaborador, Imagen} = require('../Domain/models')



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

const validarColecciones = async(coleccion = '', colleciones = []) => {

    const incluida = colleciones.includes( coleccion);
    if(!incluida){
        throw new Error(`La collecion ${coleccion} no es permitida`);
    }
}

const validarColeccionesBD = async(coleccion = '') => {

    const db = mongoose.connection;
    const colecciones = await db.db.listCollections().toArray();
    const nombreColecciones = colecciones.map(coleccion => coleccion.name)
    const incluida = nombreColecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, coleciones permitidas ${nombreColecciones}`);
    }
}

const validarexisteImg = async(id = '') =>{

    const imagen = await Imagen.findById(id);
    if(!imagen){
        throw new Error('no existe la imagen')
    }
      
}

const validarOpciones = (opciones = [] ) =>{

    console.log(opciones.length);
    if( opciones.length === 0){
        throw new Error('La opciones de donacion son requeridas');
    }
}



module.exports = {
    validarexisteImg,
    validarColecciones,
    validarColeccionesBD,
    validarRol,
    validarEmail,
    validarId,
    validarNIdentificacion,
    validarOpciones,
    validarUsername
}