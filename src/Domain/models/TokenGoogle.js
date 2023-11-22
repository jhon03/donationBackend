const { Schema, model} = require('mongoose'); 

const tokenGoogleSchema = Schema({

    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Number,
        required: true
    }

});

tokenGoogleSchema.methods.toJSON = function(){
    const {__v, _id, ...tokenG} = this.toObject();
    tokenG.uid = _id;
    return tokenG;
}


module.exports = model('TokenGoogle', tokenGoogleSchema)