export interface Productos {
  result:           Producto[];
  codigoRespuesta:  string;
  mensajeRespuesta: string;
}

export interface Producto {
  id:                   number;
  nombre:               string;
  descripcion:          string;
  categoria:            number;
  imagen:               string;
  precio:               number;
  stock:                number;
}
