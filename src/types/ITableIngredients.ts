
// ITableIngredients.ts
import { IInsumo } from "../types/IInsumo";

export interface ITableIngredients {
  dataIngredients: IInsumo[];
  handleDeleteItem: (indice: number) => void;
}