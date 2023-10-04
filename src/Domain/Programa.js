class Programa {


    constructor(idPrograma, nombre, eslogan, descripción, imagen, descripcion, TipoAporte, costo, fechaCreacion, fechaModificacion, usuCreador, usuModificador, Estado, idColaborador) {


      this.idPrograma = idPrograma;
      this.nombre = nombre;
      this.eslogan = eslogan;
      this.descripción = descripción;
      this.imagen = imagen;
      this.descripcion = descripcion;
      this.fechaCreacion = fechaCreacion;
      this.fechaModificacion = fechaModificacion;
      this.usuCreador = usuCreador;
      this.usuModificador = usuModificador; 
      this.Estado = Estado;


    this.Colaborador.idColaborador = idColaborador;

    }

  get idPrograma(){
    return this.idPrograma;
  }
  set idPrograma(idPrograma){
    this.idPrograma = idPrograma;
  }
  get nombre(){
    return this.nombre;
  }
  set nombre(nombre){
    this.nombre = nombre;
  }
  get procedencia(){
    return this.procedencia;
  }
  set descripción1(descripción1){
    this.descripción1 = descripción1;
  }
  get imagen(){
    return this.imagen;
  }
  set imagen(imagen){
    this.imagen = imagen;
  }
  get descripcion(){
    return this.descripcion;
  }
  set descripcion(descripcion){
    this.descripcion = descripcion;
  }
  get TipoAporte(){
    return this.TipoAporte;
  }
  set TipoAporte(TipoAporte){
    this.TipoAporte = TipoAporte;
  }
  get costo(){
    return this.costo;
  }
  set costo(costo){
    this.costo = costo;
  }
  get fechaCreacion(){
    return this.fechaCreacion;
  }
  set fechaCreacion(fechaCreacion){
    this.fechaCreacion = fechaCreacion;
  }
  get fechaModificacion(){
    return this.fechaModificacion;
  }
  set fechaModificacion(fechaModificacion){
    this.fechaModificacion = fechaModificacion;
  }
  get usuCreador(){
    return this.usuCreador;
  }
  set usuCreador(usuCreador){
    this.usuCreador = usuCreador;
  }
  get usuModificador(){
    return this.usuModificador;
  }
  set usuModificador(usuModificador){
    this.usuModificador = usuModificador;
  }
  get Estado(){
    return this.Estado;
  }
  set Estado(Estado){
    this.Estado = Estado;
  }
}

module.exports = Programa;