const authRoutes = require('./auth.routes');
const benefactorRoutes = require('./benefactor.routes');
const colaboradorRoutes = require('./colaborador.routes');
const donacionRoutes = require('./donacion.routes');
const donacionAnonimaRoutes = require('./donacionAnonima.routes');
const donacionProgramaRoutes = require('./donacionPrograma.routes');
const programaRoutes = require('./programa.routes');
const proyectoRoutes = require('./proyecto.routes');
<<<<<<< HEAD
=======
const uqloadRoutes = require('./uqloads.routes');
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf


module.exports = {
    ...authRoutes,
    ...benefactorRoutes,
    ...colaboradorRoutes,
    ...donacionRoutes,
    ...donacionAnonimaRoutes,
    ...donacionProgramaRoutes,
    ...programaRoutes,
<<<<<<< HEAD
    ...proyectoRoutes
=======
    ...proyectoRoutes,
    ...uqloadRoutes,
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
}