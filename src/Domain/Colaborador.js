class Colaborador{


    constructor(codColaborador, tipoIdentificacion, numeroIdentificacion, nombre, username, contraseña, correo, celular, cargo,  fechaCreacion, fechaModificacion, colCreador, colModificador, Estado) {


      this.codColaborador = codColaborador;
      this.tipoIdentificacion = tipoIdentificacion;
      this.numeroIdentificacion = numeroIdentificacion;
      this.nombre = nombre;
      this.username = username;
      this.constraseña = contraseña; 

      this.correo = correo;
      this.celular = celular; 
      this.cargo = cargo;
      this.fechaCreacion = fechaCreacion;
      this.fechaModificacion = fechaModificacion;

      this.colCreador = colCreador;
      this.colModificadore = colModificador;
      this.Estado = Estado;

    }
}

module.exports = Colaborador;