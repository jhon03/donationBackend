const {Schema, model} = require('mongoose');

const colaboradorSchema = Schema({

  tipoIdentificacion: {
    type: String, 
    required: [true, 'el tipo de identificacion en requerida'],
  },
  numeroIdentificacion: {
    type: Number,
    required: [true, 'el numero de identificacion es requerido'],
    unique: true

  },
  nombre: {
    type: String,
    required: [true, 'el nombre es requerido'],
  },
  username: {
    type: String,
    required: [true, 'el username es requerido'],
    unique: true
  },
  contrasena: {
    type: String,
    required: [true, 'el password es requerido']
  },
  correo: {
    type: String,
    required: [true, 'el correo es requerido'],
  },
  celular: {
    type: Number,
    required: [true, 'el celular es requerido']
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
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'el rol es requerido'],
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


