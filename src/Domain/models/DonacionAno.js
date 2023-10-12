const {Schema, model} = require('mongoose');

const donacionAnoSchema = Schema({

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

  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'el proyecto es requerido'],

  },

  aporte: {
    type: Number,
    required: [true,'El monto del aporte es requerido']
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
    required: [true, 'la fecha de creacion es requerida'],
  },

  estado: {
    type: Boolean,
    default: true,
    required: [true, 'el estado es requerido'],
  }
});


//modificar metodo json respuesta
donacionAnoSchema.methods.toJSON = function(){
    const {__v, _id, estado,  ...donacionA} = this.toObject();
    donacionA.uid = _id;
    return donacionA;
}

module.exports = model('DonacionesAnonima', donacionAnoSchema);