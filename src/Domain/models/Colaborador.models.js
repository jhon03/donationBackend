const {Schema, model} = require('mongoose');

const colaboradorSchema = Schema({

  tipoIdentificacion: {
    type: String, 
    required: [true, 'el tipo de identificacion en requerida'],
  },
  numeroIdentificacion: {
    type: Number,
    required: [true, 'el numero de identificacion es requerido'],
<<<<<<< HEAD
=======
    unique: true
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
  },
  nombre: {
    type: String,
    required: [true, 'el nombre es requerido'],
  },
  username: {
    type: String,
    required: [true, 'el username es requerido'],
<<<<<<< HEAD
=======
    unique: true
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
  },
  contrasena: {
    type: String,
    required: [true, 'el password es requerido']
  },
  correo: {
    type: String,
    required: [true, 'el correo es requerido'],
<<<<<<< HEAD
  },
  celular: {
    type: Number,
    required: [true, 'el celular es requerido']
=======
    unique: true
  },
  celular: {
    type: Number,
    required: [true, 'el celular es requerido'],
    unique: true
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
  },
  cargo: {
    type: String,
    required: [true, 'el cargo es requerido'],
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  },
  fechaModificacion: { 
    type: Date,
    default: Date.now
  },
  rol:{
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
});


//modificar metodo json respuesta
colaboradorSchema.methods.toJSON = function(){
    const {__v, contrasena, _id, ...colaborador} = this.toObject();
    colaborador.uid = _id;
    return colaborador;
}

module.exports = model('Colaborador', colaboradorSchema);


