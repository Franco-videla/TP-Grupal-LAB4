export interface categorias {
  id: number;
  denominacion: string;
  categorias_hijas: categorias[] | null;
}
