const { response, request} = require('express');
const path = require('path');
const fs = require('fs');


const cloudinary = require('cloudinary').v2   //importamos clouddinary
cloudinary.config(process.env.CLOUDINARY_URL);

const {check} = require('express-validator');
const { subirArchivo, buscarModelo, eliminarImagenPrevia } = require('../helpers');
const { validarImg } = require('../middlewares');
const { Programa, Proyecto, Colaborador} = require('../Domain/models')


const obtenerImg = async(req, res = response) =>{

const {coleccion, id} = req.params;

  try {
    const modelo = await buscarModelo(coleccion, id, res);
    
    if(modelo.imagen ){     //limpiar imagenes previas
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.imagen);                   //borrar imagen del servidor
      if(fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen)     //con el res.sendfile podemos mandar la imagen de respuesta
      }
    }
    
    const pathImagenR = path.join( __dirname, '../assets/imagen not found.png',)    //si no hay imagen mandamos imagen de relleno
    res.sendFile(pathImagenR)   

  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}




const subirImg = async(req= request, res= response) =>{

  const {coleccion, id} = req.params;

  try {     //siempre usar bloque try-catch al trabajar con promesas
    const modelo = await buscarModelo(coleccion,id, res);
    if(modelo.imagen  ){     //limpiar imagenes previas
      eliminarImagenPrevia(coleccion, modelo.imagen);
    }

    const nombre = await subirArchivo(req.files, coleccion); 
    modelo.imagen = nombre
    await modelo.save()
    res.json({
      msg: 'imagen subida correctamente',
      coleccion: modelo
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }

}

const actualizarImg = async(req = request, res = response) => {

  const { coleccion, id} = req.params;

  const modelo = await buscarModelo(coleccion,id, res);

  if(modelo.imagen === ''){
    return res.status(400).json({
      msg: "No hay imagen para actualizar"
    });
  }

  //eliminar imagenes anteriores
  eliminarImagenPrevia(coleccion, modelo.imagen);

  const nombre = await subirArchivo( req.files, coleccion);
  modelo.imagen = nombre;
  await modelo.save();

  res.json({
    msg: `imagen del ${coleccion} actualizada correctamente`,
    coleccion: modelo, 
  })
} 



const subirImgCloud = async(req= request, res= response) =>{

  const {coleccion, id} = req.params;

  try {     //siempre usar bloque try-catch al trabajar con promesas
    const modelo = await buscarModelo(coleccion,id, res);
    
    if(modelo.imagen ){     //limpiar imagenes previas
      const nombreArr = modelo.imagen.split('/');
      const nombre = nombreArr[ nombreArr.length - 1];
      const [public_id] = nombre.split('.');
      cloudinary.uploader.destroy( public_id);
    }

    const {tempFilePath} = req.files.archivo;   //configuracion cloudinary
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath )
    modelo.imagen = secure_url
    await modelo.save()
    res.json({
      modelo
    })

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    })
  }

}

const eliminarImagenCloud = async(req, res= response) => {
  const {coleccion, id} = req.params;
  let modelo;

  switch (coleccion) {
    case 'programas':
        modelo = await Programa.findByIdAndUpdate(id, {imagen : ""}); 
        //modelo= await Programa.findById(id);
      break;
    case 'proyectos':
        modelo = await Proyecto.findByIdAndUpdate(id, {imagen: ""});   
    default:
      return res.status(400).json({
        msg: 'la coleccion no existe'
      })
  }

  const nombreArr = modelo.imagen.split('/');
  const nombre = nombreArr[ nombreArr.length - 1];
  const [public_id] = nombre.split('.');
  cloudinary.uploader.destroy( public_id);

  console.log(public_id);


  console.log(modelo)
  res.json({
    msg: 'imagen eliminada',
    modelo
  })

}







module.exports = {
  actualizarImg,
  eliminarImagenCloud,
  subirImg,
  subirImgCloud,
  obtenerImg
}