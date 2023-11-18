const jwt = require('jsonwebtoken');

const generarJWT = (uid ='', expiracion= '4h') =>{

    return new Promise( (resolve, rejec) =>{
        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: expiracion
        }, (error, token) => {
            if(error){
                console.log(error);
                rejec('no se pudo generar el token')
            } else {
                resolve(token);
            }
        })
    })

}

module.exports = {
    generarJWT
}