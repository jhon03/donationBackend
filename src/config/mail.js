const nodemailer = require('nodemailer');
const { OAuth2Client } = require ('google-auth-library');
const { TokenR, TokenG } = require('../Domain/models');
const { json } = require('express');

const sendCorreo = async (destinatario, asunto, contenido) => {
    try {
        const transporter = await dataTrasporter();    //servidor de gmail
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


//metodo conexion servidor de correo con autenticacion por token( mas seguro)
const dataTrasporter = async (servidor = 'gmail') =>{
    try {
        const {oAuth2Client, token} = await getAuthenticatedClient();
        const accessToken = await oAuth2Client.getAccessToken();
        const expiracion = oAuth2Client.credentials;
        let transporter = nodemailer.createTransport({
            service: servidor,
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: token.refreshToken,
                accessToken: accessToken,
            }
        });
        return transporter;
    } catch (error) {
        throw new Error('Ha ocurrido un error en la comunicacion con el servicor');
    }
};

const getAuthenticatedClient = async () =>{
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.OAUTH_CLIENTID,
            process.env.OAUTH_CLIENT_SECRET,
            process.env.OAUTH_REDIRECT_URI
        )

        const token = await getToken();
        oAuth2Client.setCredentials({
            refresh_token: token.refreshToken
        });
        
        if( tokenNeedsRefresh(oAuth2Client.credentials) ){
            const refreshedToken = await refreshedAcessToken(oAuth2Client);
            oAuth2Client.setCredentials(refreshedToken);
        }
        return {oAuth2Client, token};
    } catch (error) {
        throw new Error("Ha ocurrido un error: en la autenticacion de google: " + error.message);
    }
}



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



const tokenNeedsRefresh = (credentials) =>{
    try {
        if(!credentials || !credentials.refresh_token || !credentials.expiry_date){
            return false;    //no hay informacion para verificar el token
        }
        const marginInSeconds = 5 * 60;    //5 minutos antes de que expire el token;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expiryTimestampInSeconds = credentials.expiry_date - marginInSeconds;
        return currentTimestampInSeconds >= expiryTimestampInSeconds;
    } catch (error) {
        throw new Error("Error al verificar la expiracion del token: " + error.message);3
    }
}

const refreshedAcessToken = async (oAuth2Client) => {
    try {
        const {tokens} = await oAuth2Client.refreshToken(oAuth2Client.credentials.refresh_token);
        await saveToken(tokens);
        return tokens;
    } catch (error) {
        throw new Error("Error al renovar el token: " + error.message);
    }
}


const saveToken = async (tokens) =>{
    try {
        const { access_token, expiry_date, refresh_token } = tokens
        const existeToken = await TokenG.findOne();
        if( existeToken ){
            existeToken.accessToken = access_token;
            existeToken.refreshToken = refresh_token;
            existeToken.expiryDate =  expiry_date;
            await existeToken.save();
        } else {
            const tokens = new TokenG(tokens);
            await tokens.save();
        }        
    } catch (error) {
        throw new Error("error al guardar el token: " + error.message);
    }
}

const getToken = async () =>{
    try {
        const token = await TokenG.findOne();
        if(!token || token == null){
            throw new Error("No existe el token en la base de datos: ");
        }
        return token;
    } catch (error) {
        throw new Error("Error al obtener los tokens de la bd: " + error.message);
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
            }
        });
        return transporter;
    } catch (error) {
        throw new Error('Ha ocurrido un error en la comunicacion con el servicor');
    }
};

module.exports = {
    sendCorreo,
}
