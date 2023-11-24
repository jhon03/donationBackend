const {Schema, model} = require('mongoose');

const colaboradorTemporalSchema = Schema({

  correo: {
    type: String,
    required: [true, 'correo de donacion']
  },

  verificado: {
    type: Boolean,
    required: [true, 'el estado del correo es requerido'],
    default: false,
  },

  data:{
    type: Object,
    required: [true, 'La donacion es requerida'],
  },

  codigoConfir: {
    type: String,
    required: [true, 'el ncodigo de confirmacion es requerido'],
  },

});

//modificar metodo json respuesta
colaboradorTemporalSchema.methods.toJSON = function(){
    const {__v, _id, ...colaborador} = this.toObject();
    return colaborador;
}

module.exports = model('ColaboradorTemp', colaboradorTemporalSchema);