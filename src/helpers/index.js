
const bdValidators = require('./bd-valiadators');
const generateJwt = require('./generate-jwt');
const programaValidators = require('./programaValidators');
const proyectoValidators = require('../helpers/proyectoValidators');
const validarBenefactor = require('../helpers/validarBenefactor');
const validarDonaciones = require('./validarDonacion');

module.exports = {
    ...bdValidators,
    ...generateJwt,
    ...programaValidators,
    ...proyectoValidators,
    ...validarBenefactor,
    ...validarDonaciones
}

