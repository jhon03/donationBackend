const { request, response } = require("express");

const validarImg = async(req= request ,res= response, next) => {
    if (!req.files || Object.keys(req.files).length === 0  || !req.files.archivo) {
        res.status(400).json({msg: 'no hay archivos en la peticion'});
        return;
    }

    next();
}


const validarExtencion = (req, res= response, next) => {
  const extencionesImg = ['png', 'jpg', 'jpeg', 'gif'];   //predefinimos extenciones permitidas

  const {archivo} = req.files;
  const extencionImg = archivo.name.split('.').pop();
  if(!extencionesImg.includes(extencionImg)){
    return res.status(400).json({
        msg: `La extencion del archivo no es permitida, extenciones permitidas ${extencionesImg}`
    })
  }
  next();
}


module.exports = {
    validarImg,
    validarExtencion
}