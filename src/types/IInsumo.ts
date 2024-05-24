import { categorias } from "./Icategorias";
import { IUnidadMedida } from "./IUnidadMedida";
export interface IInsumo {
  id: number; // O cambia a number si es necesario
  denominacion: string;
  unidadMedida: IUnidadMedida;
  categoria: categorias;
  cantidad: number;
}
