const bcryptjs = require('bcryptjs');
const {
  Benefactor,
  Colaborador,
  Donacion,
  DonacionAno,
  DonacionPrograma,
  Programa,
  Proyecto,
  Imagen,
} = require("../Domain/models");
const { buscarEstado } = require("./proyectos.helpers");
const { obtenerEstado } = require('./programas.helpers');

const buscarColeccion = async (modelo, NomRelacion, id = 0) => {
  try {
    console.log(id);
    console.log(modelo);
    const coleccion = await modelo.findById(id);
    if (!coleccion) {
      throw new Error(`No existe el ${NomRelacion} con este id`);
    }
    return coleccion;
  } catch (error) {
    throw new Error('Error al buscar la coleccion: ' + error.message);
  }
};

const validarEstadoColeccion = (coleccion, NomRelacion) => {
  try {
      if (coleccion.estado === "oculto" || coleccion.estado === "eliminado") {
        throw new Error(`El ${NomRelacion}, esta oculto o eliminado`);
      }
  } catch (error) {
    throw new Error('Error al validar el estado de la coleccion: ' + error.message);
  }
};

const validarFechaDonacion = (coleccion, NomRelacion) => {
  try {
    const fechaActual = new Date();
    if (coleccion.fechaFinalizacion < fechaActual) {
      throw new Error(
        `La donación no está permitida, el ${NomRelacion} ha caducado`
      );
    }
  } catch (error) {
    throw new Error('Error al validar la fecha de donacion: ' + error.message);
  }
};

const findColeccion = (modelo) => {
  try {
    switch (modelo) {
      case "benefactor":
        return Benefactor;
      case "colaborador":
        return Colaborador;
      case "donacion":
        return Donacion;
      case "donacionAnonima":
        return DonacionAno;
      case "donacionPrograma":
        return DonacionPrograma;
      case "programa":
        return Programa;
      case "proyecto":
        return Proyecto;
      case "uploads":
        return Imagen;
      default:
        throw new Error('coleccion no permitida: ' + modelo);
    }
  } catch (error) {
    throw new Error('Error al buscar la coleccion: ' + error.message);
  }
  
};

const obtenerColeccionUrl = (req) => {
  try {
    const rutaBase = req.baseUrl; // "/api/..."
    const partesRuta = rutaBase.split("/");
    const coleccion = partesRuta[2]; // El segundo segmento después de "/api/"
    return coleccion;
  } catch (error) {
    throw new Error("ha ocurrido un error al obtener la coleccion");
  }
};

const obtenermodeloUrl = (req) => {
  try {
    const rutaBase = req.originalUrl; // "/api/..."
    const partesRuta = rutaBase.split("/");
    const coleccion = partesRuta[3]; // El segundo segmento después de "/api/"
    console.log(partesRuta);
    return coleccion;
  } catch (error) {
    throw new Error("ha ocurrido un error al obtener la coleccion");
  }
};

const listPaginada = (listaOrdenada, pagina = 1, limite = 5) =>{
  try {
    const desde = (pagina-1) * limite;
    const hasta = pagina * limite;
    const paginacionList = listaOrdenada.slice(desde, hasta);
    return paginacionList;
  } catch (error) {
    throw new Error(`Error al devolver la lista paginada: ${error.message}`);
  }
}

const cambiarEstadoColeccion = async (modelo, id, accion = '') => {
  try {
      let query = buscarEstado(accion);
      const coleccion = await modelo.findByIdAndUpdate(id, query, {new:true} );
      if (!coleccion || coleccion === null) {
          throw new Error(`${id}`);
      }
      return coleccion;
  } catch (error) {
      throw Error(`Error al actualizar el estado de el proyecto ${error.message}`);
  }
}

const updateColeccion = async(modelo, id, resto) =>{
  try {
      console.log(modelo);
      resto.fechaModificacion = new Date();   //seteamos la fecha de modificacion a la de la hora de modificacion
      const documento = await modelo.findByIdAndUpdate( id, resto, {new: true} );  //usamos el new:true para devolver el objeto actualido
      return documento;
  } catch (error) {
      throw new Error(`Error al actualizar el proyecto: ${error.message}`)
  }

}

const encryptarContra = (resto, contrasena) => {
  try {
    const salt = bcryptjs.genSaltSync();  //encriptar nueva contraseña
    resto.contrasena= bcryptjs.hashSync( contrasena, salt);
  } catch (error) {
    throw new Error(`Error al encryptar la contraseña: ${error.message}`);
  }
}

const buscarDocumentos = async(modelo, opcionesBusqueda = [], limite=5, desde=0, query)=>{
  try {

      const [total, documentos] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
          modelo.countDocuments(query),  //devuelve los datos por indice
          modelo.find(query)
            .skip(desde)
            .limit(limite)
      ]);

      const docs = await Promise.all(documentos.map(async doc => {
        for (let opcion of opcionesBusqueda) {
            await doc.populate(opcion.campo, opcion.nombre);
        }
        return doc;
      }));

      return { total, docs };
  } catch (error) {
      throw new Error('Ha ocurrido un error al buscar los documentos: ' + error.message);
  }
}

const buscarDocumentoId = async(modelo, id, opcionesBusqueda = [], token = '') =>{
  try {
      let documento = await modelo.findOne({ _id : id, ...obtenerEstado(token) })
      if(!documento || documento === null){
          throw new Error(`El ${modelo.modelName} con id ${id} no existe o esta oculto -estado`);
      }
      for (let opcion of opcionesBusqueda) {
        documento = await documento.populate(opcion.campo, opcion.nombre);
      }

      return documento;
  } catch (error) {
      throw new Error(`error al buscar el programa: ${error.message}`)
  }
}

const obtenerOpcionesBus = (modelo = '') => {
  try {
    let opcionesBusqueda = [];
    switch (modelo) {
      case 'proyecto':
        opcionesBusqueda = [
          {campo: 'programa', nombre: 'nombre'},
          {campo: 'imagenes', nombre: 'url'},
        ];
        break;
      case 'programa':
        opcionesBusqueda = [
          {campo: 'colaborador', nombre: 'nombre'},
          {campo: 'imagenes', nombre: 'url'},
        ];
        break;
      case 'colaborador':
        opcionesBusqueda = [
          {campo: 'rol', nombre: 'rol'},
        ];
        break;
        default:
          opcionesBusqueda = []
        break;
    }
    
    return opcionesBusqueda;
  } catch (error) {
    throw new Error(`Error al obtener las opciones de busqueda: ${error.message}`);
  }
} 

module.exports = {
  buscarColeccion,
  buscarDocumentos,
  buscarDocumentoId,
  cambiarEstadoColeccion,
  encryptarContra,
  findColeccion,
  listPaginada,
  obtenerColeccionUrl,
  obtenermodeloUrl,
  obtenerOpcionesBus,
  validarFechaDonacion,
  validarEstadoColeccion,
  updateColeccion,
};
