
const bdValidators = require('./bd-valiadators');
const generateJwt = require('./generate-jwt');
const programaValidators = require('./programaValidators');
const proyectoValidators = require('../helpers/proyectoValidators');
<<<<<<< HEAD
=======
const subirArchivos = require('./subirArchivos');
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
const validarBenefactor = require('../helpers/validarBenefactor');
const validarDonaciones = require('./validarDonacion');

module.exports = {
    ...bdValidators,
    ...generateJwt,
    ...programaValidators,
    ...proyectoValidators,
<<<<<<< HEAD
=======
    ...subirArchivos,
>>>>>>> 1547cdec241cfaf65c30e13ba05ed4cb24463ecf
    ...validarBenefactor,
    ...validarDonaciones
}

