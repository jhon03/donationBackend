const { Schema, model} = require('mongoose'); 

const programaSchema = Schema({
    nombre: {
        type: String,
        required:[true,'El nombre es obligatorio']
    },
    eslogan: {
        type: String,
        required:[true,'El eslogan es obligatorio'],
    },
    descripcion: {
        type: String
    },

    imagenes: [{
      type: Schema.Types.ObjectId,
      ref: 'Imagen',
      required: [true, 'La imagen es requerida']  
    }],

    fechaCreacion: {
        type: Date,
        default: Date.now,
        required:[true,'El nombre es obligatorio'],
    },
    fechaModificacion: {
        type: Date,
        default: Date.now
    },
    usuCreador: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    usuModificador: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    estado: {
        type: String,
        default:'visible',
        required: true,
    },
    opcionesColaboracion: {
        type: [String],  // Campo que acepta una lista de strings
        default: [],    // Valor por defecto: un arreglo vacío
    },
    colaborador: {
        type: Schema.Types.ObjectId,
        ref: 'Colaborador',
        required: true
    },
});

programaSchema.methods.toJSON = function(){
    const {__v, _id, ...programa} = this.toObject();
    programa.uid = _id;
    return programa;
}


module.exports = model('Programa', programaSchema)