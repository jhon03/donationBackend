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

  try {     //siempre usar bloque try-catch al trabajar con promesas
      const modelo = await buscarModelo(coleccion, id);

      const {tempFilePath} = req.files.archivo;   //url de imagen cloudinary
      const secure_url = await subirImagen(tempFilePath, coleccion);   //subimos imagen al cloud

      const nuevaImagen = await crearImagen(secure_url, modelo, coleccion);     
      modelo.imagenes.push(nuevaImagen._id);    //añadimos la imagen al proyecto o programa
      await modelo.save()

      res.json({
        img: 'imagen subida correctamente',
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
    
    console.log('error 0');
    const modelo = await buscarModeloImg(coleccion, id);
    console.log('error 1');
    
    await eliminarImgCloud(coleccion, id);
    console.log('error 2');

    await remoImgLista(modelo, id);
    console.log('error 3\n' + id);

    await Imagen.findByIdAndRemove(id);
    console.log('error 4\n' + id);

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

const deleteAllImg = async(req, res= response) =>{
  try {
    
    const {coleccion, id} = req.params;

    const imagenes = await Imagen.find( {relacion: id} );
    for( let img of imagenes){
      await eliminarImgCloud(coleccion, img._id);
      await Imagen.findByIdAndRemove(img._id);
    }

    const modelo = await buscarModelo(coleccion, id);
    modelo.imagenes = [];
    await modelo.save();

    return res.json({
      msg: `se han eliminado todas las imagenes de ${modelo.nombre}`,
      modelo
    })

  } catch (error) {
    return res.status(500).json({
      msg: 'ha ocurrrido un error',
      error
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
  deleteAllImg,
  eliminarImagenCloud,
  obtenerImagenes,
  obtenerImagenId,
  subirImgCloud,
}