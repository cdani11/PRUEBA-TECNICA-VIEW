export enum TipoCompra {
  Directa = 1,
  Licitacion = 2,
  Convenio = 3
}

export const TipoCompraDescripcion: { [key in TipoCompra]: string } = {
  [TipoCompra.Directa]: "Directa",
  [TipoCompra.Licitacion]: "Licitación",
  [TipoCompra.Convenio]: "Convenio",
};

export function obtenerTiposCompra(): { descripcion: string; valor: number }[] {
  return Object.keys(TipoCompra)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      descripcion: TipoCompraDescripcion[Number(key) as TipoCompra],
      valor: Number(key)
    }));
}


export enum EstadoSolicitud {
  Pendiente = 1,
  Aprobada = 2,
  Rechazada = 3
}

export const EstadoDescripcion: { [key in EstadoSolicitud]: string } = {
  [EstadoSolicitud.Pendiente]: "Pendiente",
  [EstadoSolicitud.Aprobada]: "Aprobada",
  [EstadoSolicitud.Rechazada]: "Rechazada",
};

export function obtenerEstados(): { descripcion: string; valor: number }[] {
  return Object.keys(EstadoSolicitud)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      descripcion: EstadoDescripcion[Number(key) as EstadoSolicitud],
      valor: Number(key)
    }));
}
