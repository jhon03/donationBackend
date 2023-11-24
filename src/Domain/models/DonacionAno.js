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

  tipo: {
    type: String,
    default: 'donacionAnonima'
  },

  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: [true, 'el proyecto es requerido'],

  },

  aporte: {
    type: String,  // Campo que acepta una lista de strings
    default: "",    // Valor por defecto: un string vacío
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
  },
  
  detalles: {
    type: String,
    default: null
  }
});


//modificar metodo json respuesta
donacionAnoSchema.methods.toJSON = function(){
    const {__v, _id, tipo, ...donacionA} = this.toObject();
    donacionA.uid = _id;
    return donacionA;
}

module.exports = model('DonacionesAnonima', donacionAnoSchema);