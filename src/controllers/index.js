
const authController = require('./auth.controller');
const benefactorController = require('./benefactor.controller');
const colaboradorController = require('./colaborador.controllers');
const donacionController = require('./donacion.controller');
const donacionAnonima = require('./donacionAnonima.controller');
const programaController = require('./programa.controller');
const proyectoController = require('./proyecto.controller');
<<<<<<< HEAD

=======
const uqloadController = require('./uqloads.controller')
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf

module.exports = {
    ...authController,
    ...benefactorController,
    ...colaboradorController,
    ...donacionController,
    ...donacionAnonima,
    ...programaController,
<<<<<<< HEAD
    ...proyectoController
=======
    ...proyectoController,
    ...uqloadController
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
}