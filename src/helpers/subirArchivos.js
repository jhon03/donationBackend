const { response, request } = require("express");
const {Programa, Proyecto, Imagen} = require('../Domain/models')

const path = require('path'); //importamos el path para formar rutas
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const cloudinary = require('cloudinary').v2   //importamos clouddinary
cloudinary.config(process.env.CLOUDINARY_URL);




const buscarModelo = async (coleccion, id) => {

  let modelo;

  switch (coleccion) {
    case 'programas':
          modelo = await Programa.findById(id); 
      break;

    case 'proyectos':
          modelo = await Proyecto.findById(id);
      break;
  
    default:
        throw new Error(`falta validar esta coleccion ${coleccion}`);
  }

  if(!modelo){
    throw new Error(`no hay ${coleccion} con el id ${id}`)
  }

  return modelo;
}


const carpetaCloudinary = async(coleccion) => {
  const carpetaCloud = `donacion/${coleccion}`;
  return carpetaCloud;
}


const subirImagen = async(archivo, coleccion) => {
  const carpetaCloud = await carpetaCloudinary(coleccion);

  const {secure_url} = await cloudinary.uploader.upload( archivo, {
    folder: carpetaCloud,
    use_filename: true    //si no exite la carpeta la crea
  });

  return secure_url;
}


const crearImagen = async(url, modelo, coleccion) => {
  const nuevaImagen = new Imagen({    //creamos la instancia de la imagen
    url,
    relacion: modelo._id,   //establece la relcion
    nombreRealacion: coleccion,
    nombre: modelo.nombre
  });
  await nuevaImagen.save();     //guardamos en BD
  return nuevaImagen;
}


const obtenerIdPublico = async(id = '') => {

  const imagen = await Imagen.findById(id);

  const nombreArr = imagen.url.split('/');
  const nombre = nombreArr[ nombreArr.length - 1];
  const [public_id] = nombre.split('.');
  return public_id;
} 


const eliminarImgCloud = async(coleccion = '', id = '') => {
  const carpetaCloud = await carpetaCloudinary(coleccion);
  const public_id = await obtenerIdPublico(id);

  const public_idCarpeta = `${carpetaCloud}/${public_id}`;
  cloudinary.uploader.destroy( public_idCarpeta);
}


const buscarModeloImg = async(coleccion = '', id = '') => {

  let modelo;
  switch (coleccion) {
    case 'programas':
        modelo = await Programa.findOne({imagenes: id});
      break;
    case 'proyectos':
        modelo = await Proyecto.findOne({ imagenes: id}); 
      break;
  
    default:
        return res.status(400).json({
          msg: 'La coleccion no es de imagenes',
        });

  }
  return modelo;
}


const remoImgLista = async (modelo = '', id= '') => {

  if(modelo){
    modelo.imagenes = modelo.imagenes.filter(imagenId => imagenId.toString() !== id);
    await modelo.save();
  }
}





module.exports = {
  buscarModeloImg,
  crearImagen,
  carpetaCloudinary,
  eliminarImgCloud,
  obtenerIdPublico,
  remoImgLista,
  subirImagen,
  buscarModelo
}