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
    console.log('coleccion:\n' + coleccion);
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

module.exports = {
  buscarColeccion,
  findColeccion,
  obtenerColeccionUrl,
  obtenermodeloUrl,
  validarFechaDonacion,
  validarEstadoColeccion,
};
