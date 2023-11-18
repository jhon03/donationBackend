const authRoutes             = require('./auth.routes');
const benefactorRoutes       = require('./benefactor.routes');
const colaboradorRoutes      = require('./colaborador.routes');
const donacionRoutes         = require('./donacion.routes');
const donacionesRoute        = require('./donaciones.route'); 
const donacionAnonimaRoutes  = require('./donacionAnonima.routes');
const donacionProgramaRoutes = require('./donacionPrograma.routes');
const programaRoutes = require('./programa.routes');
const proyectoRoutes = require('./proyecto.routes');
const uqloadRoutes = require('./uqloads.routes');


module.exports = {
    ...authRoutes,
    ...benefactorRoutes,
    ...colaboradorRoutes,
    ...donacionRoutes,
    ...donacionesRoute,
    ...donacionAnonimaRoutes,
    ...donacionProgramaRoutes,
    ...programaRoutes,
    ...proyectoRoutes,
    ...uqloadRoutes,

}