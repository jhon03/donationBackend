
const bdValidators = require('./bd-valiadators');
const generateJwt = require('./generate-jwt');
const programaValidators = require('./programaValidators')

module.exports = {
    ...bdValidators,
    ...generateJwt,
    ...programaValidators
}

