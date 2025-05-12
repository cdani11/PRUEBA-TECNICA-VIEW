export interface Solicitudes {
  result:           Solicitud[];
  codigoRespuesta:  string;
  mensajeRespuesta: string;
}

export interface Solicitud {
  id:                   number;
  descripcion:          string;
  estadoSolicitud:      number;
  usuarioId:            number;
  nombre:               string;
  direccionSolicitante : string;
  tipoCompra:           number;
  fechaEsperada:        Date;
}
