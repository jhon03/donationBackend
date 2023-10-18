const { response, request } = require("express");
const {Programa, Proyecto} = require('../Domain/models')

const path = require('path'); //importamos el path para formar rutas
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const extencionesImg = ['png', 'jpg', 'jpeg', 'gif'];   //predefinimos extenciones permitidas

const subirArchivo = (files, carpeta= '') => {    //para el helper usamos de argumentos el archivo(files), ext permitidas, y la carpeta de ser necesario

    return new Promise( (resolve, reject) => {
        const archivo = files.archivo;
        const extencion = archivo.name.split('.').pop();   // el pop nos devuelve el ultimo dato del array en este caso la extencion

        if(!validarExtencion(archivo)){
            return reject(`la extencion  ${extencion} no es permitida`);
        }
        
        const nombreTemp = generarNombreUnico(extencion);     //creamos uuid para archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);   //creamos el path donde se guardara el archivo

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemp);
        });
    })

}

const validarExtencion = (archivo) => {
    const extencionImg = archivo.name.split('.').pop();
    return extencionesImg.includes(extencionImg);
}

const generarNombreUnico = (extencion)=> {
    return uuidv4() + '.' + extencion;
}


const buscarModelo = async (coleccion, id, res) => {

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


const eliminarImagenPrevia = (coleccion, nombreImagen) => {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, nombreImagen);                   //borrar imagen del servidor
      if(fs.existsSync(pathImagen)){
        fs.unlinkSync( pathImagen);
      }
}


module.exports = {
    subirArchivo,
    generarNombreUnico,
    validarExtencion,
    buscarModelo,
    eliminarImagenPrevia
}