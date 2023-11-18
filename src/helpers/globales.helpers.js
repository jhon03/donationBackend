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
  const coleccion = await modelo.findById(id);
  if (!coleccion) {
    throw new Error(`No existe el ${NomRelacion} con este id`);
  }
  return coleccion;
};

const validarEstadoColeccion = (coleccion, NomRelacion) => {
  if (coleccion.estado === "oculto" || coleccion.estado === "eliminado") {
    throw new Error(`El ${NomRelacion}, esta oculto o eliminado`);
  }
};

const validarFechaDonacion = (coleccion, NomRelacion) => {
  const fechaActual = new Date();
  if (coleccion.fechaFinalizacion < fechaActual) {
    throw new Error(
      `La donación no está permitida, el ${NomRelacion} ha caducado`
    );
  }
};

const findColeccion = (modelo) => {
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
      break;
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

module.exports = {
  buscarColeccion,
  findColeccion,
  obtenerColeccionUrl,
  validarFechaDonacion,
  validarEstadoColeccion,
};
