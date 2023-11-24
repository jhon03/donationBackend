const { DonacionPrograma, DonacionTemporal } = require("../Domain/models");
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


const enviarCorreo = async (donacion, accion, mensaje = '') =>{
    try {
        const {destinatario, asunto, contenido} = await generarDataCorreo(donacion ,accion, mensaje);
        const correoEnv = await sendCorreo(destinatario, asunto, contenido);
        return correoEnv;
    } catch (error) {
        throw new Error('Error al enviar el correo: ' + error.message);
    }
}




const validarCorreoDona = async (correo) =>{
    try {
        const donacionTemp = await DonacionTemporal.findOne({correo});
        let estado = 'verificado';
        if(!donacionTemp || donacionTemp == null){
            estado = 'inexistente';
        } else if(!donacionTemp.verificado){
            estado = 'verificar';
        }
        return {donacionTemp, estado};
    } catch (error) {
        throw new Error('Error al intentar validar el correo: ' + correo);
    }
}

const generarDataCorreo = async(donacion, accion, mensaje = '') =>{
    try {
        const nombrepro = await encontrarNombrePro(donacion);  
        switch (accion) {
            case 'bienvenida':
              return await correoBienvenida(donacion, nombrepro);
            case 'confirmar':
              return await confirmarCorreo(donacion, nombrepro);
            case 'entregar':
              return await formEntregaCorreo(donacion, nombrepro, mensaje);
            case 'rechazar':
              return await correoRechazarDona(donacion, nombrepro, mensaje);
            case 'recibido':
              return await correoRecibido(donacion, nombrepro);
            case 'rechazar_benefactor':
                return await correoDonacionRechada(donacion, nombrepro);
            default:
              throw new Error("Accion incorrecta al manejar el envio del correo");
        } 
    } catch (error) {
        throw new Error(error.message);
    }
}

const confirmarCorreo = async (donacion, nombrePro) =>{
    try {
        const {nombreBenefactor: nombre, correo} = donacion;
        const codigoConfir = crypto.randomBytes(3).toString('hex');
        let asunto = "Bienvenido al nuestra red de donantes"; 
        pathPage = path.join(__dirname, '../assets/confirmarCorreo.html');
        let contenido = fs.readFileSync(pathPage, 'utf-8');
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{codigo\}/g, codigoConfir);

        await crearDonacionTemp(donacion, codigoConfir);
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
        contenido = contenido.replace('{mensaje}', mensaje);

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
        console.log(donacion);
        const { _id: id, nombreBenefactor: nombre, correo, tipo, aporte } = donacion;
        console.log(nombre)
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
const crearDonacionTemp = async(donacion, codigoConfir) => {
    try {
        const exitsDonacion = await DonacionTemporal.findOne({correo: donacion.correo});
        if(exitsDonacion){
            if(!exitsDonacion.verificado){
                exitsDonacion.codigoConfir = codigoConfir;
                exitsDonacion.data = donacion;
                return await exitsDonacion.save();
            } else{
                throw new Error(`El correo ya ha sido verificado no puedes modificar su estado`);
            }           
        } 
        const donacionTemporal = new DonacionTemporal({
            correo: donacion.correo,
            data:donacion,
            codigoConfir,
        })
        await donacionTemporal.save();
        return donacionTemporal;
    } catch (error) {
        throw new Error('Error al crear la donacion temporal: ' + error.message);
    }
}

const validarCodigoYEstadoCorreo = (donacion, codigo) =>{
    try {
        if(donacion.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(donacion.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + donacionTemp.codigoConfir + " codigo: " + codigo)
        }
    } catch (error) {
        throw new Error('Error al validar el correo: ' + error.message);
    }
}

const encontrarNombrePro = async(donacion) =>{
    try {
        let nombrepro;
        if(donacion.tipo === 'donacionAnonima'){
            const proyecto = await proyectoFindById(donacion.proyecto._id);
            nombrepro = proyecto.nombre;
        } else if(donacion.tipo === 'donacionPrograma'){
            const programa = await programaFindById(donacion.programa._id);
            nombrepro = programa.nombre;
        } else {
            throw new Error('El parametro no esta validado: ' + donacion.tipo);
        }
        return nombrepro
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    confirmarCorreo,
    crearDonacionTemp,
    enviarCorreo,
    generarDataCorreo,
    tipoColeccion,
    validarCorreoDona,
    verificarCorreoDona,
}