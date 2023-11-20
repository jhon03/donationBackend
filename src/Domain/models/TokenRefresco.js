const { Schema, model} = require('mongoose'); 

const tokenRefreshSchema = Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Colaborador',
        required: true
    },
    tokenRefreso: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: new Date()
    }
});

tokenRefreshSchema.methods.toJSON = function(){
    const {__v, _id, ...tokenRefresh} = this.toObject();
    tokenRefresh.uid = _id;
    return tokenRefresh;
}


module.exports = model('TokenRefresh', tokenRefreshSchema)