const {Schema, model} = require('mongoose');

const donacionProgramaSchema = Schema({

  tipoIdentificacion: {
    type: String
  },
  numeroIdentificacion: {
    type: Number,
    required: [true, 'el numero de identificacion es requerido'],
  },

  nombreBenefactor: {
    type: String,
    required: [true, 'el benefactor es requerido'],
  },

  correo: {
    type: String,
    required: [true, 'el correo es requerido']
  },

  celular: {
    type: Number
  },

  programa: {
    type: Schema.Types.ObjectId,
    ref: 'Programa',
    required: [true, 'el programa es requerido'],

  },

  aporte: {
    type: String,
    default: '',
    required: [true,'El aporte es requerido']
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
    required: [true, 'la fecha de creacion es requerida'],
  },

  estado: {
    type: String,
    default: "en proceso",
    required: [true, 'el estado es requerido'],
  }
});


//modificar metodo json respuesta
donacionProgramaSchema.methods.toJSON = function(){
    const {__v, _id, ...donacionPrograma} = this.toObject();
    donacionPrograma.uid = _id;
    return donacionPrograma;
}

module.exports = model('DonacionesPrograma', donacionProgramaSchema);