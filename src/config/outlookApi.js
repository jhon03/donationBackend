const nodemailer = require('nodemailer');

const sendCorreo = async (destinatario, asunto, contenido) => {
    try {
        const transporter = dataTrasporterMicrosoft();    //servidor microsoft
        let mailOptions = dataMessage( destinatario, asunto, contenido);
        const resultado = await transporter.sendMail(mailOptions);
        console.log("Correo enviado correctamente:", resultado);
        return resultado;
    } catch (error) {
        console.log("Error al enviar el correo: " +  error)
        throw new Error(`error al enviar el correo ${error}`);
    }
};

const dataMessage = (destinatario, asunto, contenido, emisor = process.env.MICROSOFT_MAIL_USERNAME ) =>{
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
            },
            logger: true
        });
        console.log(transporter);
        return transporter;
    } catch (error) {
        throw new Error('Ha ocurrido un error en la comunicacion con el servicor');
    }
};



module.exports = {
    sendCorreo,
}