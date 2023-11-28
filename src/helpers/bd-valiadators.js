

const { default: mongoose } = require('mongoose');
const {Role, Colaborador, Imagen} = require('../Domain/models')



const validarRol = async(rol = '') =>{        //verificacion personalizada de rol contra la bd
    try {
        const existeRol = await Role.findOne({rol});
        if(!existeRol || existeRol === null){
            throw new Error(`El rol ${rol} que intenta asignar no esta registrado en la base de datos`)
        }
    } catch (error) {
        throw new Error(error.message);
    }   
}

const validarEmail = async(correo = '')=>{
    try {
        const colaborador = await Colaborador.findOne({ correo});
        if(colaborador && colaborador.estado ){
            throw new Error(`el correo: ${correo}, ya esta registrado`)
        }
    } catch (error) {
        throw new Error(error.message);
    }    
}

const validarId = async(id) =>{
    try {
        const existeColaborador = await Colaborador.findById(id);
        if(!existeColaborador || !existeColaborador.estado){
            throw new Error(`el id no existe ${id} o esta inactivo`)
        }
    } catch (error) {
        throw new Error(error.message);
    }   
}

const validarNIdentificacion = async(numeroIdentificacion) =>{
    try {
        const colaborador = await Colaborador.findOne({numeroIdentificacion});
        if(colaborador && colaborador.estado){
            throw  new Error('ya se encuentra un usuario registrado con este numero identificación');
        }
    } catch (error) {
        throw new Error(error.message);
    }   
}

const validarUsername = async(username) =>{
    try {
        const usuario = await Colaborador.findOne({username});
        if(usuario && usuario.estado){
            throw new Error(`ya hay un usuario con el username ${username}`)
        }
    } catch (error) {
        throw new Error(error.message);
    }    
}

const validarColecciones = async(coleccion = '', colleciones = []) => {
    try {
        const incluida = colleciones.includes( coleccion);
        if(!incluida){
            throw new Error(`La collecion ${coleccion} no es permitida`);
        }
    } catch (error) {
        throw new Error(error.message);
    }    
}

const validarColeccionesBD = async(coleccion = '') => {
    try {
        const db = mongoose.connection;
        const colecciones = await db.db.listCollections().toArray();
        const nombreColecciones = colecciones.map(coleccion => coleccion.name)
        const incluida = nombreColecciones.includes(coleccion);
        if(!incluida){
            throw new Error(`La coleccion ${coleccion} no es permitida, coleciones permitidas ${nombreColecciones}`);
        }
    } catch (error) {
        throw new Error(error.message);
    }    
}

const validarexisteImg = async(id = '') =>{
    try {
        const imagen = await Imagen.findById(id);
        if(!imagen){
            throw new Error('no existe la imagen')
        }
    } catch (error) {
        throw new Error(error.message)
    }      
}

const validarOpciones =  (opciones = [] ) =>{
    try {
        console.log(opciones.length);
        if( opciones.length === 0){
            throw new Error('La opciones de donacion son requeridas');
        }
    } catch (error) {
        throw new Error(error.message);
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