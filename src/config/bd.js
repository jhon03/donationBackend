const mongoose = require('mongoose')

const db_uri = 'mongodb://localhost:27017/gestion_proyectos'

module.exports = () => {
    const connect = () => {

        mongoose.connect(
            db_uri,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUniFiedTopology: true
            },

            (err) => {
                if (err) {

                    console.log('DB: ERROR !!');
                } else {
                    console.log('Conexión Establecida !!')
                }
            }
        )
    }

    connect();
}



