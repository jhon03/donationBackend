const { response, request} = require('express');

const cloudinary = require('cloudinary').v2   //importamos clouddinary
cloudinary.config(process.env.CLOUDINARY_URL);

const { buscarModelo, subirImagen, crearImagen, eliminarImgCloud, buscarModeloImg, remoImgLista } = require('../helpers');
const { Imagen} = require('../Domain/models')


const obtenerImagenes = async(req = request, res = response) => {
  try {
    const [total, imagenes] = await Promise.all([    //utilaza promesas para que se ejecuten las dos peticiones a la vez
        Imagen.countDocuments(),
        Imagen.find()
        
    ]);

    res.json({
        total,
        imagenes
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: 'Algo a ocurrido en el backend'
    })
  }
}

const obtenerImagenId = async(req, res = response) => {
  try {
    const {id} = req.params;
    const imagen = await Imagen.findById(id)

    res.json({
        imagen
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: 'hubo un error inesperado'
    })
  }
}

const subirImgCloud = async(req= request, res= response) =>{

  const {coleccion, id} = req.params;
  console.log('subir img')

  try {     //siempre usar bloque try-catch al trabajar con promesas
      const modelo = await buscarModelo(coleccion, id);
      console.log('error modelo')

      const {tempFilePath} = req.files.archivo;   //url de imagen cloudinary
      console.log('error file')
      const secure_url = await subirImagen(tempFilePath, coleccion);   //subimos imagen al cloud
      console.log('error subir imagen')

      const nuevaImagen = await crearImagen(secure_url, modelo, coleccion);     
      console.log('error 2')
      modelo.imagenes.push(nuevaImagen._id);    //añadimos la imagen al proyecto o programa
      await modelo.save()

      res.json({
        modelo
      })

  } catch (error) {
      res.status(400).json({
        msg: error.message,
        msg: 'sucedio algo inesperado'
      })
  }

}

const eliminarImagenCloud = async(req, res= response) => {

  try {
    const {id, coleccion} = req.params;
  
    await eliminarImgCloud(coleccion, id);

    const modelo = await buscarModeloImg(coleccion, id);
    await remoImgLista(modelo, id);
    await Imagen.findByIdAndRemove(id);

    res.json({
      msg: 'imagen eliminada',
      modelo
    })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
    })
  }

  

}


const actualizarImagenCloud = async (req, res = response) => {
  const { id, coleccion } = req.params;
  

  try {
    const imagen = await Imagen.findById(id);

    const { tempFilePath } = req.files.archivo;
    const secure_url = await subirImagen(tempFilePath, coleccion);

    await eliminarImgCloud(coleccion, id);   //eliminamos la imagen mediante helper
  
    imagen.url = secure_url;    // Actualiza la URL de la imagen en el modelo
    await imagen.save();

    res.json({
      msg: 'Imagen actualizada correctamente',
      imagen,
    });

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};







module.exports = {
  actualizarImagenCloud,
  eliminarImagenCloud,
  obtenerImagenes,
  obtenerImagenId,
  subirImgCloud,
}