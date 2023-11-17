const {DonacionAno, DonacionPrograma, DonacionTemporal} = require('../Domain/models');
const { findColeccion } = require('./globales.helpers');
const path = require('path');
const fs = require('fs');
const { generarJWT } = require('./generate-jwt');
const crypto = require('crypto');



const obtenerDonaciones = async(modelo, CampoRelacion)=>{
    try {

        const [total, coleccion] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
                modelo.countDocuments(),  //devuelve los datos por indice
                modelo.find()
                .populate(CampoRelacion,'nombre')
            //.skip(Number(desde))
            //.limit(Number(limite))
        ]);

        return {total, coleccion};

    } catch (error) {
        throw new Error(`Ha ocurrrido un error al buscar las doanciones ${error.message}`);
    }
}

const listDonaciones = async(pagina = 1, limite = 5)=>{
    try {
        const {total: total1, coleccion: Donacionesprogramas } = await obtenerDonaciones(DonacionPrograma, 'programa');  //primera coleccion(donacion programa)
        const {total: total2, coleccion: Donacionesproyectos } = await obtenerDonaciones(DonacionAno, 'proyecto');       // segunda coleccion (donacion proyecto)
        const listaDonaciones = [...Donacionesprogramas, ...Donacionesproyectos];
        const listaOrdenada = listaDonaciones.sort((a, b) => b.fechaCreacion - a.fechaCreacion );
        const desde = (pagina-1) * limite;
        const hasta = pagina * limite;
        const donacionesPaginacion = listaOrdenada.slice(desde, hasta);
        return {total: listaDonaciones.length, donaciones: donacionesPaginacion};
    } catch (error) {
        throw new Error('ha ocurrido un error al devolver la lista de donaciones ' + error.message);
    }
}

const findByid = (id, donaciones)=>{
    try {
        const donacionEncontrada = donaciones.filter(donacion => donacion._id.toString() === id.toString() );
        console.log(donacionEncontrada);
        if(!donacionEncontrada || donacionEncontrada.length === 0){
            throw new Error(`no se encuebtra donacion con el id: ${id}`);
        }
        return donacionEncontrada[0];
    } catch (error) {
        throw new Error(`ha ocurrido un error al buscar la donacion: ${error.message}`);
    }
}

const modificarDonacion = async(id= 0,aceptar=false, rechazar=false) => {
    try {
        const {total, donaciones} = await listDonaciones(1, 2000);
        const donacionEncontrada = findByid(id, donaciones);
        const modelo = findColeccion(donacionEncontrada.tipo);
        const donacionAct = await cambiarEstadoDonacion(donacionEncontrada, modelo, aceptar, rechazar);
        return donacionAct;
    } catch (error) {
        throw new Error(error.message);
    }
}

const cambiarEstadoDonacion = async (donacion, modelo, aceptar =false, rechazar=false) =>{
    try {
        let donacionActualizada = donacion;

        if(aceptar){
            if(donacion.estado === 'rechazada' || donacion.estado === 'terminada'){
                throw new Error(`Ya se resolvio la donacion estado: ${donacion.estado}`);
            }
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'terminada');
        }
        if(rechazar){
            if(donacion.estado === 'terminada' || donacion.estado === 'rechazada'){
                throw new Error(`Ya se resolvio la donacion estado: ${donacion.estado}`);
            }
            donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'rechazada');
        }
        if(donacion.estado === 'en proceso'){
           donacionActualizada = await updateStateDonacion(donacion._id, modelo, 'abierta');
        }
        return donacionActualizada;
    } catch (error) {
        throw new Error(error.message);
    }
}

//sirve pra actualizar cualquier donacion que este dividida por modelo
const updateStateDonacion = async(id, modelo, estado = 'en proceso') =>{
    try {
        const donacionAct = await modelo.findByIdAndUpdate(id, {estado}, {new:true});
        if(donacionAct == null){
            throw new Error('No existe la donacion con el id: ' + id);
        }
        return donacionAct;
    } catch (error) {
        throw new Error(`Error al actualiar la donacion: ${error.message}`);
    }
}


const buscarDonacion = (id=0, donacion)=>{
    try {
        const coleccion = findColeccion(donacion.tipo);
        const donacionEnc = coleccion.findById(id);
        return donacionEnc;
    } catch (error) {
        throw new Error(`La donacion con el id ${id} no existe`);
    }
}

const dataCorrreoDonacion = async (correo, nombre, id, formEntrega = false) =>{
    try {
        const token = await generarJWT(id);     //token para confirmar entrega de donacion
        let pathPage = path.join(__dirname, '../assets/paginaWelcome.html');
        let asunto = "Bienvenido al nuestra red de donantes"; 
        if(formEntrega){
            pathPage = path.join(__dirname, '../assets/paginaCondiciones.html');
            asunto = "Formulario de condiciones entrega de donacion"
        }          
        let contenido = fs.readFileSync(pathPage, 'utf-8')
        contenido = contenido.replace('{nombre}', nombre);
        contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
        if(formEntrega){
            contenido = contenido.replace(/\{token\}/g, encodeURIComponent(token) );
        }
        return {destinatario: correo, asunto, contenido};
    } catch (error) {
        throw new Error(`Error al obtener los datos de la plantilla del correo: ${error.message}`);
    }
}




// const generarDataCorreo = async(id, nombre, correo, donacion, accion) =>{
//     try {
//         console.log(accion);
//         if(accion === 'bienvenida'){         
//             return await correoBienvenida(id, nombre, correo);
//         } else if(accion === 'confirmar'){
//             return await confirmarCorreo(nombre, correo, donacion);
//         } else if(accion === 'entregar'){
//             return await formEntregaCorreo(id, nombre, correo);
//         } else {
//             throw new Error("Accion incorrecta al manejar el envio del correo");
//         }
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// const confirmarCorreo = async (nombre, correo, donacion) =>{
//     try {
//         const codigoConfir = crypto.randomBytes(3).toString('hex');
//         console.log("codigo confirmacion correo: " + codigoConfir);
//         let asunto = "Bienvenido al nuestra red de donantes"; 
//         pathPage = path.join(__dirname, '../assets/confirmarCorreo.html');
//         let contenido = fs.readFileSync(pathPage, 'utf-8');
//         contenido = contenido.replace(/\{nombre\}/g, nombre);
//         contenido = contenido.replace(/\{codigo\}/g, codigoConfir);

//         const donacionTemp = new DonacionTemporal({
//             correo: donacion.correo,
//             data:donacion,
//             codigoConfir,
//         })
//         await donacionTemp.save();

//         return {destinatario: correo, asunto, contenido};

//     } catch (error) {
//         throw new Error('error al enviar el correo de confirmacion:' + error.message)
//     }
// }

// const formEntregaCorreo = async (id, nombre, correo)=>{
//     try {
//         const token = await generarJWT(id);     //token para confirmar entrega de donacion      
//         pathPage = path.join(__dirname, '../assets/paginaCondiciones.html');
//         asunto = "Formulario de condiciones entrega de donacion"

//         let contenido = fs.readFileSync(pathPage, 'utf-8')
//         contenido = contenido.replace('{nombre}', nombre);
//         contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
//         contenido = contenido.replace(/{token}/g, encodeURIComponent(token));

//         return {destinatario: correo, asunto, contenido};

//     } catch (error) {
//         throw new Error('Error al enviar el formulario de entrega donacion: ' + error.message);
//     }
// }

// const correoBienvenida = async (id, nombre, correo)=>{
//     try {
//         let pathPage = path.join(__dirname, '../assets/paginaWelcome.html');
//         let asunto = "Bienvenido al nuestra red de donantes"; 

//         let contenido = fs.readFileSync(pathPage, 'utf-8')
//         contenido = contenido.replace('{nombre}', nombre);
//         contenido = contenido.replace(/\{id\}/g, encodeURIComponent(id) );
//         return {destinatario: correo ,asunto, contenido};
//     } catch (error) {
//         throw new Error('error al enviar el correo de bienvenida: ' + error.message);
//     }
// }

// const validarCorreo = async (correo) =>{
//     try {
//         const donacionTemp = await DonacionTemporal.findOne({correo});
//         let estado = 'verificado';
//         if(!donacionTemp){
//             estado = 'inexistente';
//             return {donacionTemp,  estado};
//         }
//         if(!donacionTemp.verificado){
//             estado = 'verificar';
//             return {donacionTemp,  estado};
//         }
//         return {donacionTemp, estado};
//     } catch (error) {
//         throw new Error('Error al intentar validar el correo: ' + correo);
//     }
// }

module.exports = {
    buscarDonacion,
    cambiarEstadoDonacion,
    dataCorrreoDonacion,
    findByid,
    listDonaciones,
    modificarDonacion,
    obtenerDonaciones,
    updateStateDonacion,

    // correoBienvenida,
    // confirmarCorreo,
    // formEntregaCorreo,
    //generarDataCorreo,
    //validarCorreo,
}