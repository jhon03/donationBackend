
const authController             = require('./auth.controller');
const benefactorController       = require('./benefactor.controller');
const colaboradorController      = require('./colaborador.controllers');
const donacionController         = require('./donacion.controller');
const donacionesController       = require('./donaciones.controller');
const donacionAnonima            = require('./donacionAnonima.controller');
const donacionProgramaController = require('./donacionesProgramas.controller');
const programaController         = require('./programa.controller');
const proyectoController         = require('./proyecto.controller');
const uqloadController           = require('./uqloads.controller')


module.exports = {
    ...authController,
    ...benefactorController,
    ...colaboradorController,
    ...donacionController,
    ...donacionesController,
    ...donacionAnonima,
    ...donacionProgramaController,
    ...programaController,
    ...proyectoController,
    ...uqloadController

}