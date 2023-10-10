const {Schema, model} = require('mongoose');

const benefactorSchema = Schema({

  tipoIdentificacion: {
    type: String
  },
  numeroIdentificacion: {
    type: Number,
    unique: true
  },
  nombre: {
    type: String,
    required: [true, 'el nombre es requerido'],
  },
  correo: {
    type: String,
    required: [true, 'el correo es requerido']
  },
  contrasena: {
    type: String,
    required: [true, 'la contraseña es requerida']
  },
  celular: {
    type: Number
  },
  estado: {
    type: Boolean,
    default: true,
    require: [true, 'el estado es requerido']
  },
  rol: {
    type: String,
    default: 'BENEFACTOR'
  }
});


//modificar metodo json respuesta
benefactorSchema.methods.toJSON = function(){
    const {__v, _id, contrasena,  ...benefactor} = this.toObject();
    benefactor.uid = _id;
    return benefactor;
}

module.exports = model('Benefactor', benefactorSchema);