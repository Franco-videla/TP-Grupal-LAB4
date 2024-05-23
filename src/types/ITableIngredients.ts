
import { IInsumo } from "../types/IInsumo";

export interface ITableIngredients {
  rows: IInsumo[];
  handleDelete: (index: number) => void;
}
