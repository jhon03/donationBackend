
const authHelpers        = require('./auth.helpers');
const bdValidators       = require('./bd-valiadators');
const correoHelpers      = require('./correo.Helpers');
const donacionesHelpers  = require('./donaciones.helpers');
const generateJwt        = require('./generate-jwt');
const globalesHelpers    = require('./globales.helpers');
const jwtHelpers         = require('./jwt.helpers');
const programaValidators = require('./programaValidators');
const programaHelpers    = require('./programas.helpers');
const proyectoHelpers    = require('./proyectos.helpers');
const proyectoValidators = require('../helpers/proyectoValidators');
const subirArchivos      = require('./subirArchivos');
const validarBenefactor  = require('../helpers/validarBenefactor');
const validarDonaciones  = require('./validarDonacion');

module.exports = {
    ...authHelpers,
    ...bdValidators,
    ...correoHelpers,
    ...donacionesHelpers,
    ...generateJwt,
    ...globalesHelpers,
    ...jwtHelpers,
    ...programaValidators,
    ...programaHelpers,
    ...proyectoValidators,
    ...proyectoHelpers,
    ...subirArchivos,
    ...validarBenefactor,
    ...validarDonaciones
}

