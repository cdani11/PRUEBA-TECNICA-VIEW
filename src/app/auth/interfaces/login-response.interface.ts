export interface LoginResponse {
  result:           Usuario;
  codigoRespuesta:  string;
  mensajeRespuesta: string;
}

export interface Usuario {
  id:              number;
  usuario:         string;
  nombre:          string;
  apellido:        string;
  email:           string;
  rolId:           number;
  nombreRol:       string;
  estado:          boolean;
  token:           string;
  fechaExpiracion: Date;
}

