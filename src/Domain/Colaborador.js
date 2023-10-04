class Colaborador{


    constructor(codColaborador, tipoIdentificacion, numeroIdentificacion, nombre, email, celular, cargo, usuario, constraseña, fechaCreacion, fechaModificacion, Estado) {


      this.codColaborador = codColaborador;
      this.tipoIdentificacion = tipoIdentificacion;
      this.numeroIdentificacion = numeroIdentificacion;
      this.nombre = nombre;
      this.email = email;
      this.celular = celular; 
      this.cargo = cargo;
      this.usuario = usuario;
      this.constraseña = constraseña;
      this.fechaCreacion = fechaCreacion;
      this.fechaModificacion = fechaModificacion;
      this.Estado = Estado;

    }
}

module.exports = Colaborador;