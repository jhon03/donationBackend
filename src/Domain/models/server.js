const express = require("express");
const cors = require('cors');

const { dbConnection } = require('../../config/database');
const path = require("path");

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            colaborador: '/api/colaborador',
            programa : '/api/programa',
            proyecto: '/api/proyecto',
            benefactor: 'api/benefactor',
        }
       
        this.middlewares();  //middleware
        this.connectDB();   //conectar a base de datos
        this.routes(); //rutas de la aplicacion
    }

    middlewares(){

        this.app.use(cors());  //cors
        this.app.use( express.json());  //lectura y parseo del body
        this.app.use(express.static(path.join(__dirname, '../public')));   //directorio publico
    }

    routes(){
        this.app.use(this.paths.auth, require('../../routes/auth.routes')) ;
        this.app.use(this.paths.colaborador, require('../../routes/colaborador.routes'));   //endpoint de user    
        this.app.use(this.paths.programa, require('../../routes/programa.routes'));
        this.app.use(this.paths.proyecto, require('../../routes/proyecto.routes'))
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