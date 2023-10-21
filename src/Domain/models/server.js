const express = require("express");
const cors = require('cors');
<<<<<<< HEAD
=======
const fileUpload = require('express-fileupload');
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf

const { dbConnection } = require('../../config/database');
const path = require("path");

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            benefactor: '/api/benefactor',
            colaborador: '/api/colaborador',
            donacion: '/api/donacion',
            donacionAno: '/api/donacionAnonima',
            donacionPrograma: '/api/donacionPrograma/',
            programa : '/api/programa',
            proyecto: '/api/proyecto',
<<<<<<< HEAD
=======
            uploads: '/api/uploads',
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
        }
       
        this.middlewares();  //middleware
        this.connectDB();   //conectar a base de datos
        this.routes(); //rutas de la aplicacion
    }

    middlewares(){

        this.app.use(cors());  //cors
        this.app.use( express.json());  //lectura y parseo del body
        this.app.use(express.static(path.join(__dirname, '../public')));   //directorio publico
<<<<<<< HEAD
=======
        this.app.use(fileUpload({     //maneja la carga de archivos 
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,  //funcion para que al momento de crear el archivo, si queremos tambien se cree una carpeta
        }));
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
    }

    routes(){
        this.app.use(this.paths.auth, require('../../routes/auth.routes')) ;
        this.app.use(this.paths.benefactor, require('../../routes/benefactor.routes'));
        this.app.use(this.paths.colaborador, require('../../routes/colaborador.routes'));   //endpoint de user    
        this.app.use(this.paths.donacion, require('../../routes/donacion.routes.js'));
        this.app.use(this.paths.donacionAno, require('../../routes/donacionAnonima.routes'));
        this.app.use(this.paths.donacionPrograma, require('../../routes/donacionPrograma.routes'))
        this.app.use(this.paths.programa, require('../../routes/programa.routes'));
        this.app.use(this.paths.proyecto, require('../../routes/proyecto.routes'));
<<<<<<< HEAD
=======
        this.app.use(this.paths.uploads, require('../../routes/uqloads.routes'))
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor iniciado en http://localhost:${this.port}`);
          })
    }

    async connectDB(){
        await dbConnection();
    }

}

module.exports = Server;