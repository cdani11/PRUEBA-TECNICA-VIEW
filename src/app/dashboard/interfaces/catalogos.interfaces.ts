export enum Categoria {
  Consumo = 1,
  BienesInmuebles = 2,
  Otros = 3
}

export const CategoriaDescripcion: { [key in Categoria]: string } = {
  [Categoria.Consumo]: "Consumo",
  [Categoria.BienesInmuebles]: "Bienes Inmuebles",
  [Categoria.Otros]: "Otros",
};

export function obtenerCategorias(): { descripcion: string; valor: number }[] {
  return Object.keys(Categoria)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      descripcion: CategoriaDescripcion[Number(key) as Categoria],
      valor: Number(key)
    }));
}
