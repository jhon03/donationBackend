const { Schema, model} = require('mongoose');

const proyectoSchema = Schema({
    nombre: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    descripcion: {
        type: String
    },
    imagen: {
        type: String
    },
    consto: {
        type: Number,
        required : [ true , 'el costo del proyecto es requerido']
    },
    fechaInicio: {
        type: Date,
        default: Date.now,
        required:[true,'La fecha de inicio es obligatoria'],
    },
    fechaFinalizacion: {
        type: Date,
        require: [true,'la fecha de finalizacion es requerida']
    },
    usuCreador: {
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    usuModificador: {
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
        required: true
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
    tipoPrograma: {
        type: String,
        required: [true, 'El tipo de programa es requerido']
    },
    programa: {
        type: Schema.Types.ObjectId,
        ref: 'Programa',
        required: true
    }
});

ProyectoSchema.methods.JSON = function(){
    const {__v, _id, ...proyecto} =this.toObjet();
    proyecto.uid = _id;
    return proyecto;
}


module.exports = model('Proyecto', proyectoSchema)