const {Schema, model} = require('mongoose');

const donacionSchema = Schema({

  benefactor: {
    type: Schema.Types.ObjectId, 
    ref: 'Benefactor',
    required: [true, 'el benefactor es requerido'],
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
    required: [true, 'el correo estado es requerido'],
  }
});


//modificar metodo json respuesta
donacionSchema.methods.toJSON = function(){
    const {__v, _id, ...donacion} = this.toObject();
    donacion.uid = _id;
    return donacion;
}

module.exports = model('Donacion', donacionSchema);

