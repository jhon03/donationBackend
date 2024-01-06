
const validarNumeroCel = (celular) => {
    try {
        const regex = /^3\d{9}$/;
        if(!regex.test(celular)){
            throw new Error('el numero de telefono no es valido, debe contener 10 numeros y comenzar por 3')
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

const validarOpcionesIdentificacion = (opcion = '') => {
    try {
        const opciones = ['Cédula', 'Pasaporte'];
        if(!opciones.includes(opcion)){
            throw new Error(`Opcion de tipo identificacion no valida`);
        }
        return true
    } catch (error) {
        throw new Error(error.message);
    }
}

const validarContrasena = (contrasena = '') => {
    try {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{6,}$/;
        if(!regex.test(contrasena)){
            throw new Error("La contraseña debe tener al menos una minúscula, una mayuscula y un caracter especial");
        }
        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    validarContrasena,
    validarOpcionesIdentificacion,
    validarNumeroCel,
}