const { Schema, model} = require('mongoose');

const proyectoSchema = Schema({

    nombre: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es requerida'],
    },
    imagen: {
        type: String,
        default: ''
    },
    costo: {
        type: Number,
        required : [ true , 'el costo del proyecto es requerido']
    },
    fechaInicio: {
        type: Date,
        required:[true,'La fecha de inicio es obligatoria'],
    },
    fechaFinalizacion: {
        type: Date,
        required: [true,'la fecha de finalizacion es requerida']
    },
    colCreador: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    colModificador: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
        required: true,
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    tipoProyecto: {
        type: String,
        required: [true, 'el tipo de proyecto es requerido']
    },

    opcionesDonacion: {
        type: [String],  // Campo que acepta una lista de strings
        default: [],    // Valor por defecto: un arreglo vacío
    },
    
    programa: {
        type: Schema.Types.ObjectId,
        ref: 'Programa',
        required: true
    },
});

proyectoSchema.methods.toJSON = function(){
    const {__v, _id, estado, ...proyecto} =this.toObject();
    proyecto.uid = _id;
    return proyecto;
}



module.exports = model('Proyecto', proyectoSchema)