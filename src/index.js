require('dotenv').config();
const Server = require('./Domain/models/server');

const server = new Server();

server.listen();
