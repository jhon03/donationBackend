const { ObjectId } = require('mongodb');
const {Schema, model} = require('mongoose');

const imagenSchema = Schema({

    url: {
        type: String,
        default: true,
        required: [true, 'el url de la imagen es requerida']
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
        required: [true, 'la fecha de creacion es requerida'],
    },

    relacion: {
        type: Schema.Types.ObjectId,
        required: [true, 'La relacion es requerida tanto de programa o proyecto'],
    
    },

    nombreRealacion: {
        type: String,
        default: '',
        required: [true,'El nombre de la coleccion relacionada es requerido'],
    },

    nombre: {
        type: String,
        default: '',
        required: [true, 'El nombre es requerido'],
    }

});


//modificar metodo json respuesta
imagenSchema.methods.toJSON = function(){
    const {__v, _id, ...imagen} = this.toObject();
    imagen.uid = _id;
    return imagen;
}

module.exports = model('Imagen', imagenSchema);

