import { IInsumo } from "./IInsumo";
import { categorias } from "./Icategorias";

export interface IProductoManufacturado {
  id: string;
  alta: boolean;
  categoria: categorias;
  denominacion: string;
  precioVenta: number;
  tiempoEstimadoMinutos: number;
  descripción: string;
  receta: string;
  ingredientes: IInsumo[];
}
