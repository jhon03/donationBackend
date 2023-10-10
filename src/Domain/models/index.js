
const Benefactor = require('./Benefactor.models');
const Colaborador = require('./Colaborador.models');
const Donacion = require('./Donacion.models');
const DonacionAno = require('./DonacionAno')
const Programa = require('./Programa.models');
const Proyecto = require('./Proyecto.models');
const Role = require('./role');
const Server = require('./server');


module.exports = {
    Benefactor,
    Colaborador,
    Donacion,
    DonacionAno,
    Programa,
    Proyecto,
    Role,
    Server,
}