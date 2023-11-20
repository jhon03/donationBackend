
const Benefactor       = require('./Benefactor.models');
const Colaborador      = require('./Colaborador.models');
const Donacion         = require('./Donacion.models');
const DonacionAno      = require('./DonacionAno');
const DonacionPrograma = require('./DonacionPrograma.models');
const DonacionTemporal = require('./DonacionesTemp');
const Imagen           = require('./Imagen.models');
const Programa         = require('./Programa.models');
const Proyecto         = require('./Proyecto.models');
const Role             = require('./role');
const Server           = require('./server');
const TokenR           = require('./TokenRefresco');


module.exports = {
    Benefactor,
    Colaborador,
    Donacion,
    DonacionAno,
    DonacionPrograma,
    DonacionTemporal,
    Imagen,
    Programa,
    Proyecto,
    Role,
    Server,
    TokenR,
}