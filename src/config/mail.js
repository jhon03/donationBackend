const nodemailer = require('nodemailer');

const sendCorreo = async (destinatario, asunto, contenido) => {
    try {
        const transporter = dataTrasporter();    //servidor de gmail
        //const transporter = dataTrasporterMicrosoft();    //servidor microsoft
        let mailOptions = dataMessage( destinatario, asunto, contenido);
        const resultado = await transporter.sendMail(mailOptions);
        console.log("Correo enviado correctamente:", resultado);
        return resultado;
    } catch (error) {
        console.log("Error al enviar el correo: " +  error)
        throw new Error(`error al enviar el correo ${error}`);
    }
};

const sendCorreoMicrosoft = async (destinatario, asunto, contenido) => {
    try {
        let transporter = dataTrasporter();
        let mailOptions = dataMessage( destinatario, asunto, contenido);
        const resultado = await transporter.sendMail(mailOptions);
        console.log("Correo enviado correctamente:", resultado);
        return resultado;
    } catch (error) {
        console.log("Error al enviar el correo: " +  error)
        throw new Error(`error al enviar el correo ${error}`);
    }
};

//metodo conexion servidor de correo con autenticacion por token( mas seguro)
const dataTrasporter = (servidor = 'gmail') =>{
    try {
        let transporter = nodemailer.createTransport({
            service: servidor,
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });
        return transporter;
    } catch (error) {
        throw new Error('Ha ocurrido un error en la comunicacion con el servicor');
    }
};

//metodo autenticacion por credenciales
const dataTrasporterMicrosoft = () =>{
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MICROSOFT_MAIL_USERNAME,
                pass: process.env.MICROSOFT_MAIL_PASSWORD,
            }
        });
        return transporter;
    } catch (error) {
        throw new Error('Ha ocurrido un error en la comunicacion con el servicor');
    }
};

const dataMessage = (destinatario, asunto, contenido, emisor = process.env.MAIL_USERNAME ) =>{
    try {
        let mailOptions = {
            from: emisor,
            to: destinatario,
            subject: asunto,
            html: contenido
        };
        return mailOptions;
    } catch (error) {
        throw new Error(`ha ocurrido un error al generar el mensaje del correo ${error.message}`);
    }
}

module.exports = {
    sendCorreo,
}
