

const obtenerToken = (req) =>{
    const token = req.headers['x-token'];
    return token;
}

module.exports = {
    obtenerToken,
}