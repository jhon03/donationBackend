class Programa {


    constructor(idProyecto, nombre, descripcion, imagen, costo, fechaInicio, FechaFinalizacion, usuCreador, usuModificador, fechaCreacion, fechaModificacion, Estado, tipoProyecto, idPrograma) {


      this.idProyecto = idProyecto;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.imagen = imagen;
      this.costo = costo;
      this.fechaInicio = fechaInicio;
      this.FechaFinalizacion = FechaFinalizacion;
      this.usuCreador = usuCreador;
      this.usuModificador = usuModificador; 
      this.fechaCreacion = fechaCreacion;
      this.fechaModificacion = fechaModificacion;
      this.Estado = Estado;
      this.tipoProyecto = tipoProyecto


      this.Programa.idPrograma = idPrograma;

    }
}

module.exports = Programa;