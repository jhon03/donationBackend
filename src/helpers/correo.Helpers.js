const { DonacionPrograma, DonacionTemporal } = require("../Domain/models");
const { sendCorreo } = require("../config/mail");
const {  validarCorreo } = require("./donaciones.helpers");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { generarJWT } = require("./generate-jwt");

const verificarCorreoDona = async (req, res) =>{
    try {
        const {correo, codigo} = req.body;
        const {donacionTemp} = await validarCorreo(correo);
        if(donacionTemp.verificado){
            throw new Error("el correo ya ha sido verificado");
        }
        if(donacionTemp.codigoConfir !== codigo){
            throw new Error('El codigo que introducite no coincide' + donacionTemp.codigoConfir + " codigo: " + codigo)
        } 
        const donacionPrograma = new DonacionPrograma(donacionTemp.data);
        donacionTemp.verificado = true;
        await donacionTemp.save();
        await donacionPrograma.save();

        const correoEnviado = await enviarCorreo(donacionPrograma._id, donacionPrograma.nombreBenefactor, donacionPrograma.correo, donacionPrograma ,'bienvenida');

        return res.status(201).json({
            msg: 'donacion creada con exito',
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}


const enviarCorreo = async (id, nombre, correo, donacion, accion) =>{
    try {
        const {destinatario, asunto, contenido} = await generarDataCorreo(id, nombre, correo, donacion ,accion);
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
        if(!donacionTemp){
            estado = 'inexistente';
            return {donacionTemp,  estado};
        }
        if(!donacionTemp.verificado){
            estado = 'verificar';
            return {donacionTemp,  estado};
        }
        return {donacionTemp, estado};
    } catch (error) {
        throw new Error('Error al intentar validar el correo: ' + correo);
    }
}

const generarDataCorreo = async(id, nombre, correo, donacion, accion) =>{
    try {
        console.log(accion);
        if(accion === 'bienvenida'){         
            return await correoBienvenida(id, nombre, correo);
        } else if(accion === 'confirmar'){
            return await confirmarCorreo(nombre, correo, donacion);
        } else if(accion === 'entregar'){
            return await formEntregaCorreo(id, nombre, correo);
        } else {
            throw new Error("Accion incorrecta al manejar el envio del correo");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const confirmarCorreo = async (nombre, correo, donacion) =>{
    try {
        const codigoConfir = crypto.randomBytes(3).toString('hex');
        console.log("codigo confirmacion correo: " + codigoConfir);
        let asunto = "Bienvenido al nuestra red de donantes"; 
        pathPage = path.join(__dirname, '../assets/confirmarCorreo.html');
        let contenido = fs.readFileSync(pathPage, 'utf-8');
        contenido = contenido.replace(/\{nombre\}/g, nombre);
        contenido = contenido.replace(/\{codigo\}/g, codigoConfir);

        const donacionTemp = new DonacionTemporal({
            correo: donacion.correo,
            data:donacion,
            codigoConfir,
        })
        await donacionTemp.save();

        return {destinatario: correo, asunto, contenido};

    } catch (error) {
        throw new Error('error al enviar el correo de confirmacion:' + error.message)
    }
}

const formEntregaCorreo = async (id, nombre, correo)=>{
    try {
        const token = await generarJWT(id);     //token para confirmar entrega de donacion      
        pathPage = path.join(__dirname, '../assets/paginaCondiciones.html');
        asunto = "Formulario de condiciones entrega de donacion"

        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace('{nombre}', nombre);
        contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
        contenido = contenido.replace(/{token}/g, encodeURIComponent(token));

        return {destinatario: correo, asunto, contenido};

    } catch (error) {
        throw new Error('Error al enviar el formulario de entrega donacion: ' + error.message);
    }
}

const correoBienvenida = async (id, nombre, correo)=>{
    try {
        let pathPage = path.join(__dirname, '../assets/paginaWelcome.html');
        let asunto = "Bienvenido al nuestra red de donantes"; 

        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace('{nombre}', nombre);
        contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
        return {destinatario: correo ,asunto, contenido};
    } catch (error) {
        throw new Error('error al enviar el correo de bienvenida: ' + error.message);
    }
}

module.exports = {
    confirmarCorreo,
    enviarCorreo,
    validarCorreoDona,
    verificarCorreoDona,
    generarDataCorreo,
}