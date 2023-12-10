const { DonacionPrograma, DonacionTemporal, ColaboradorTemp } = require("../Domain/models");
const { sendCorreo } = require("../config");
const {  validarCorreo } = require("./donaciones.helpers");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { generarJWT } = require("./generate-jwt");
const { proyectoFindById } = require("./proyectos.helpers");
const { programaFindById } = require("./programas.helpers");

const verificarCorreoDona = async (req, res) =>{
    try {
        const {correo, codigo} = req.body;
        const {donacionTemp} = await validarCorreo(correo);
        validarCodigoYEstadoCorreo(donacionTemp, codigo);
        const donacionPrograma = new DonacionPrograma(donacionTemp.data);
        donacionTemp.verificado = true;
        await Promise.all([donacionTemp.save(), donacionPrograma.save()]);
        await enviarCorreo(donacionPrograma ,'bienvenida');

        return res.status(201).json({
            msg: 'donacion creada con exito',
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


const enviarCorreo = async (coleccion, accion, mensaje = '') =>{
    try {
        const {destinatario, asunto, contenido} = await generarDataCorreo(coleccion ,accion, mensaje);
        const correoEnv = await sendCorreo(destinatario, asunto, contenido);
        return correoEnv;
    } catch (error) {
        throw new Error('Error al enviar el correo: ' + error.message);
    }
}




const validarCorreoModel = async (correo, modelo) =>{
    try {
        const coleccion = await modelo.findOne({correo});
        let estado = 'verificado';
        if(!coleccion || coleccion == null){
            estado = 'inexistente';
        } else if(!coleccion.verificado){
            estado = 'verificar';
        }
        return {coleccion, estado};
    } catch (error) {
        throw new Error('Error al intentar validar el correo: ' + correo);
    }
}

const generarDataCorreo = async(coleccion, accion, mensaje = '') =>{
    try {
        const nombrepro = await encontrarNombrePro(coleccion);  
        switch (accion) {
            case 'bienvenida':
              return await correoBienvenida(coleccion, nombrepro);
            case 'confirmar':
              return await confirmarCorreo(coleccion, nombrepro);
            case 'entregar':
              return await formEntregaCorreo(coleccion, nombrepro, mensaje);
            case 'rechazar':
              return await correoRechazarDona(coleccion, nombrepro, mensaje);
            case 'recibido':
              return await correoRecibido(coleccion, nombrepro);
            case 'rechazar_benefactor':
                return await correoDonacionRechada(coleccion, nombrepro);
            default:
              throw new Error("Accion incorrecta al manejar el envio del correo");
        } 
    } catch (error) {
        throw new Error(error.message);
    }
}

const confirmarCorreo = async (coleccion, nombrePro) =>{
    try {
        const {nombre, correo} = validarTipoCol(coleccion);  //devuleve los datos necesarios dependiendo la coleccion
        const codigoConfir = crearCodigoConfir();
        let asunto = "Codigo de confirmacion registro de correo"; 
        pathPage = path.join(__dirname, '../assets/confirmarCorreo.html');
        let contenido = fs.readFileSync(pathPage, 'utf-8');
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{codigo\}/g, codigoConfir);

        if(!coleccion.tipo){
            await crearDataTemporal(ColaboradorTemp ,coleccion, codigoConfir);
        } else {
            await crearDataTemporal(DonacionTemporal ,coleccion, codigoConfir);
        }
        return {destinatario: correo, asunto, contenido};

    } catch (error) {
        throw new Error('error al enviar el correo de confirmacion:' + error.message)
    }
}

const formEntregaCorreo = async (donacion, nombrePro, mensaje = 'chat')=>{
    try {
        const { _id: id , nombreBenefactor: nombre, correo, tipo, aporte} = donacion;
        const token = await generarJWT(id, '365d');     //token para confirmar entrega de donacion      
        pathPage = path.join(__dirname, '../assets/paginaCondiciones.html');
        asunto = "Formulario de condiciones entrega de donacion"
        let tipoC = tipoColeccion(tipo);

        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace('{nombre}', nombre);
        contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
        contenido = contenido.replace(/{token}/g, encodeURIComponent(token));
        contenido = contenido.replace('{tipoC}', tipoC);
        contenido = contenido.replace('{nombreC}', nombrePro);
        contenido = contenido.replace(/\{opcionDona\}/g, aporte);
        // contenido = contenido.replace('{mensaje}', mensaje);

        return {destinatario: correo, asunto, contenido};

    } catch (error) {
        throw new Error('Error al enviar el formulario de entrega donacion: ' + error.message);
    }
}

const correoBienvenida = async (donacion, nombrePro)=>{
    try {
        const { _id: id, nombreBenefactor: nombre, correo, tipo } = donacion;
        const pathPage = path.join(__dirname, '../assets/paginaWelcome.html');
        const asunto = "Bienvenido al nuestra red de donantes"; 

        let tipoC = tipoColeccion(tipo);
        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
        contenido = contenido.replace(/\{tipoC\}/g, tipoC);
        contenido = contenido.replace(/\{nombreC\}/g, nombrePro);
        return {destinatario: correo ,asunto, contenido};
    } catch (error) {
        throw new Error('error al enviar el correo de bienvenida: ' + error.message);
    }
}

//correo rechazo donacion colaborador
const correoRechazarDona = async (donacion, nombrePro, mensaje = '') =>{
    try {
        const { _id: id, nombreBenefactor: nombre, correo, tipo } = donacion;
        const pathPage = path.join(__dirname, '../assets/rechazarDonacion.html');
        const asunto = "Motivo rechazo de donacion"; 
        let tipoC = tipoColeccion(tipo);
        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{tipoC\}/g, tipoC);
        contenido = contenido.replace(/\{nombreC\}/g, nombrePro);
        contenido = contenido.replace(/\{mensaje\}/g, mensaje);
        return {destinatario: correo ,asunto, contenido};
    } catch (error) {
        throw new Error('error al enviar el correo de rechazo de la donación: ' + error.message);
    }
}

const correoRecibido = async (donacion, nombrePro, mensaje = '') =>{
    try {
        const { _id: id, nombreBenefactor: nombre, correo, tipo, aporte } = donacion;
        const pathPage = path.join(__dirname, '../assets/correoRecibido.html');
        const asunto = "Donacion Recibida"; 
        let tipoC = tipoColeccion(tipo);
        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{tipoC\}/g, tipoC);
        contenido = contenido.replace(/\{nombreC\}/g, nombrePro);
        contenido = contenido.replace(/\{opcionDona\}/g, aporte);
        return {destinatario: correo ,asunto, contenido};
    } catch (error) {
        throw new Error('Error al crear el correo de recibido: ' + error.message);
    }
}

//correo donacion rechaza por el benefactor
const correoDonacionRechada = async(donacion, nombrePro, mensaje = '') =>{
    try {
        const { _id: id, nombreBenefactor: nombre, correo, tipo } = donacion;
        const pathPage = path.join(__dirname, '../assets/rechazaBenefactor.html');
        const asunto = "Termino del proceso de donacion"; 
        let tipoC = tipoColeccion(tipo);
        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{tipoC\}/g, tipoC);
        contenido = contenido.replace(/\{nombreC\}/g, nombrePro);
        contenido = contenido.replace(/\{mensaje\}/g, mensaje);
        return {destinatario: correo ,asunto, contenido};
    } catch (error) {
        throw new Error('error al enviar el correo de rechazo de la donación: ' + error.message);
    }
}

const tipoColeccion = (tipo) => {
    try {
        let tipoC;
        if(tipo === 'donacionAnonima'){
            tipoC = 'Proyecto'
        } else if(tipo === 'donacionPrograma'){
            tipoC = 'Programa'
        } else{
            throw new Error(`parametro invalido: ${tipo}`);
        }
        return tipoC;
    } catch (error) {
        throw new Error('Error al encontart el tipo de coleccion: ' + error.message);
    }
}

//dos opciones o mandar una alerta que ya tienes un codigo o crar uno nuevo
const crearDataTemporal = async(modelo, coleccion, codigoConfir) => {
    try {
        const documento = await modelo.findOne({correo: coleccion.correo});
        if(documento || documento !== null){
            if(!documento.verificado){
                documento.codigoConfir = codigoConfir;
                documento.data = coleccion;
                return await documento.save();
            } else{
                throw new Error(`El correo ya ha sido verificado no puedes modificar su estado`);
            }           
        } 
        const nuevoDocumento = new modelo({
            correo: coleccion.correo,
            data:coleccion,
            codigoConfir,
        })
        console.log(nuevoDocumento);
        await nuevoDocumento.save();
        return nuevoDocumento;
    } catch (error) {
        throw new Error('Error al crear la donacion temporal: ' + error.message);
    }
}

const validarCodigoYEstadoCorreo = (coleccion, codigo) =>{
    try {
        if(coleccion.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(coleccion.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + coleccion.codigoConfir + " codigo: " + codigo)
        }
    } catch (error) {
        throw new Error('Error al validar el correo: ' + error.message);
    }
}

//funcion para encontrar nombre de tipo de donacion
const encontrarNombrePro = async(donacion) =>{
    try {
        let nombrepro;
        if(donacion.tipo === 'donacionAnonima'){
            const proyecto = await proyectoFindById(donacion.proyecto._id);
            nombrepro = proyecto.nombre;
        } else if(donacion.tipo === 'donacionPrograma'){
            const programa = await programaFindById(donacion.programa._id);
            nombrepro = programa.nombre;
        } else if(!donacion.tipo){
            nombrepro = 'colaorador';
        } else {
            throw new Error('El parametro no esta validado: ' + donacion.tipo);
        }
        return nombrepro
    } catch (error) {
        throw new Error(error.message);
    }
}

const crearCodigoConfir = () =>{
    try {
        const codigo = crypto.randomBytes(3).toString('hex');
        return codigo;
    } catch (error) {
        throw new Error(`Error al crear el codigo de confirmacion: ${error.message}`);
    }
}

const validarTipoCol = (coleccion) => {
    try {
        if(coleccion.tipo){
            return {nombre: coleccion.nombreBenefactor, correo: coleccion.correo};
        } else {
            return {nombre: coleccion.nombre, correo: coleccion.correo};
        }
    } catch (error) {
        throw new Error(`Error al devolver la coleccion desectructurada: ${error.message}`);
    }
}

module.exports = {
    confirmarCorreo,
    crearDataTemporal,
    enviarCorreo,
    generarDataCorreo,
    tipoColeccion,
    validarCorreoModel,
    verificarCorreoDona,
}