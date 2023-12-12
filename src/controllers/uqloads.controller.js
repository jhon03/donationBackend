const { response, request} = require('express');

const cloudinary = require('cloudinary').v2   //importamos clouddinary
cloudinary.config(process.env.CLOUDINARY_URL);

const { buscarModelo, subirImagen, crearImagen, eliminarImgCloud, buscarModeloImg, remoImgLista } = require('../helpers');
const { Imagen} = require('../Domain/models')


const obtenerImagenes = async(req = request, res = response) => {
  try {
    const tokenNuevo = req.tokenRenovado;
    const [total, imagenes] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
        Imagen.countDocuments(),
        Imagen.find()       
    ]);

    if(tokenNuevo && tokenNuevo !== null){
      return res.json({tokenNuevo, total, imagenes});
    }
    return res.json({
        total,
        imagenes
    });
  } catch (error) {
    res.status(400).json({
      msg: 'error al obtener las imagenes',
      error: error.message
    })
  }
}

const obtenerImagenId = async(req, res = response) => {
  try {
    const tokenNuevo = req.tokenRenovado;
    const {id} = req.params;
    const imagen = await Imagen.findById(id)

    if(tokenNuevo && tokenNuevo !== null){
      return res.json({tokenNuevo, imagen});
    }
    return res.json({
        imagen
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      msg: 'error al obtener la imagen',
      error: error.message
    })
  }
}

const subirImgCloud = async(req= request, res= response) =>{

  
  try {     //siempre usar bloque try-catch al trabajar con promesas
      const {coleccion, id} = req.params;
      const tokenNuevo = req.tokenRenovado;

      const modelo = await buscarModelo(coleccion, id);
      const {tempFilePath} = req.files.archivo;   //url de imagen cloudinary
      const secure_url = await subirImagen(tempFilePath, coleccion);   //subimos imagen al cloud
      const nuevaImagen = await crearImagen(secure_url, modelo, coleccion);     
      modelo.imagenes.push(nuevaImagen._id);    //añadimos la imagen al proyecto o programa
      await modelo.save()

      if(tokenNuevo && tokenNuevo !== null){
        return res.json({tokenNuevo, msg: 'imagen subida correctamente', modelo});
      }
      return res.json({
        img: 'imagen subida correctamente',
        modelo
      })

  } catch (error) {
      res.status(400).json({
        msg: 'error al subir la imagen',
        error: error.message,
      })
  }

}

const eliminarImagenCloud = async(req, res= response) => {

  try {
    const tokenNuevo = req.tokenRenovado;
    const {id, coleccion} = req.params;
    const modelo = await buscarModeloImg(coleccion, id);   
    await eliminarImgCloud(coleccion, id);
    await remoImgLista(modelo, id);
    await Imagen.findByIdAndRemove(id);

    if(tokenNuevo && tokenNuevo !== null){
      return res.json({tokenNuevo, msg: 'imagen eliminada', modelo});
    }
    return res.json({
      msg: 'imagen eliminada',
      modelo
    })

  } catch (error) {
    res.status(400).json({
      msg: 'error al eliminar la imagen ',
      error: error.message,
    })
  }

}

const deleteAllImg = async(req, res= response) =>{
  try {   
    const tokenNuevo = req.tokenRenovado;
    const {coleccion, id} = req.params;
    const imagenes = await Imagen.find( {relacion: id} );
    for( let img of imagenes){
      await eliminarImgCloud(coleccion, img._id);
      await Imagen.findByIdAndRemove(img._id);
    }
    const modelo = await buscarModelo(coleccion, id);
    modelo.imagenes = [];
    await modelo.save();
    if(tokenNuevo && tokenNuevo !== null){
      return res.json({tokenNuevo, msg: `se han eliminado todas las imagenes de ${modelo.nombre}`, modelo});
    }
    return res.json({
      msg: `se han eliminado todas las imagenes de ${modelo.nombre}`,
      modelo
    })

  } catch (error) {
    return res.status(400).json({
      msg: 'error al eliminar las imagenes',
      error: error.message
    })
  }
}


const actualizarImagenCloud = async (req, res = response) => { 
  try {
    const tokenNuevo = req.tokenRenovado;
    const { id, coleccion } = req.params;
    const imagen = await Imagen.findById(id);
    const { tempFilePath } = req.files.archivo;
    const secure_url = await subirImagen(tempFilePath, coleccion);

    await eliminarImgCloud(coleccion, id);   //eliminamos la imagen mediante helper
  
    imagen.url = secure_url;    // Actualiza la URL de la imagen en el modelo
    await imagen.save();

    if(tokenNuevo && tokenNuevo !== null){
      return res.json({tokenNuevo, msg: 'Imagen actualizada correctamente', imagen,});
    }
    return res.json({
      msg: 'Imagen actualizada correctamente',
      imagen,
    });

  } catch (error) {
    res.status(400).json({
      msg: 'error al actualizar la imagen',
      error: error.message,
    });
  }
};







module.exports = {
  actualizarImagenCloud,
  deleteAllImg,
  eliminarImagenCloud,
  obtenerImagenes,
  obtenerImagenId,
  subirImgCloud,
}