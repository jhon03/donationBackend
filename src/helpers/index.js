
const bdValidators = require('./bd-valiadators');
const generateJwt = require('./generate-jwt');
const programaValidators = require('./programaValidators');
const proyectoValidators = require('../helpers/proyectoValidators')

module.exports = {
    ...bdValidators,
    ...generateJwt,
    ...programaValidators,
    ...proyectoValidators
}

