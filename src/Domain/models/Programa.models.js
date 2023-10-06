const { Schema, model} = require('mongoose');

const programaSchema = Schema({
    nombre: {
        type: String,
        required:[true,'El nombre es obligatorio'],
        unique: true
    },
    eslogan: {
        type: String,
        required:[true,'El eslogan es obligatorio'],
    },
    descripcion: {
        type: String
    },
    tipoAporte: {
        type: String
    },

    costo: {
        type: Number,
        required:[true,"Costo del Programa"]
    },
    imagen: {
        type: String,
        default: ""
    },
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
        type: Boolean,
        default:true,
        required: true,
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