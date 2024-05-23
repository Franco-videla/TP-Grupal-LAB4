import {
  Button,
  MenuItem,
  Modal,
  Select,
  TextField,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  InputAdornment,
  DialogActions
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TableIngredients } from "../../tables/TableIngredients/TableIngredients";
import { IInsumo } from "../../../../types/IInsumo";
import { categorias } from "../../../../types/Icategorias";
import { CategoriaComidaService } from "../../../../services/CategoriaComidaService";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { InsumoServices } from "../../../../services/InsumosServices";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import styles from "./MasterDetailModal.module.css";

const API_URL = import.meta.env.VITE_API_URL;

interface IMasterDetailModal {
  open: boolean;
  handleClose: () => void;
  getData: () => void;
}

export const MasterDetailModal: FC<IMasterDetailModal> = ({ handleClose, open, getData }) => {
  const [itemValue, setItemValue] = useState<IProductoManufacturado>({
    id: "0",
    alta: true,
    categoria: {
      id: "0",
      denominacion: "Seleccione una categoria",
      categorias_hijas: null,
    },
    denominacion: "",
    precioVenta: 100,
    tiempoEstimadoMinutos: 10,
    descripción: "",
    receta: "",
    ingredientes: [],
  });

  const [deleteIndex, setDeleteIndex] = useState<number>(-1);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [categoriaComidas, setCategoriaComidas] = useState<categorias[]>([]);
  const [insumosCategories, setInsumosCategories] = useState<categorias[]>([]);
  const [insumosByCategorie, setInsumosByCategorie] = useState<IInsumo[]>([]);
  const [valueInsumos, setValueInsumo] = useState<any>({
    categoriaInsumo: "Categoria",
    ingrediente: {
      id: "0",
      denominacion: "Ingrediente",
      unidadMedida: {
        id: 1,
        denominacion: "",
        abreviatura: "",
      },
      categoria: {
        id: 1,
        denominacion: "",
      },
      cantidad: 0,
    },
    cantidad: 1,
  });

  const [errors, setErrors] = useState<any>({
    denominacion: "",
    categoria: "",
    precioVenta: "",
    tiempoEstimadoMinutos: "",
    descripción: "",
    receta: "",
  });

  const categoriaComidaService = new CategoriaComidaService(`${API_URL}/categorias_comida`);
  const categoriaInsumosService = new CategoriaComidaService(`${API_URL}/categorias_insumos`);
  const productoManufacturadoService = new ProductoManufacturadoService(`${API_URL}/producto_manufacturado`);
  const insumosServices = new InsumoServices(`${API_URL}/insumos`);

  const handleChangeCategorieArticuloManufacturado = (e: any) => {
    const id = e.target.value;
    const categoria = categoriaComidas.find((cat) => cat.id === id);
    if (categoria) {
      setItemValue({ ...itemValue, categoria });
      setErrors({ ...errors, categoria: "" });
    } else {
      setErrors({ ...errors, categoria: "Debe seleccionar una categoría" });
    }
  };

  const handleChangeinsumosCategories = async (e: any) => {
    const insumos = await insumosServices.getAll();
    const denominacion = e.target.value;
    setValueInsumo({ ...valueInsumos, categoriaInsumo: denominacion });
    const result = insumos.filter((el) => el.categoria.denominacion === denominacion);
    setInsumosByCategorie(result);
  };

  const handleChangeInsumosValues = async (e: any) => {
    const { value } = e.target;
    const res = await insumosServices.getById(value);
    if (res) setValueInsumo({ ...valueInsumos, ingrediente: res });
  };

  const handleAmountInsumoValue = (e: any) => {
    const { value } = e.target;
    setValueInsumo({ ...valueInsumos, cantidad: value });
  };

  const handleNewIngredient = () => {
    const parse = {
      ...valueInsumos.ingrediente,
      id: itemValue.ingredientes.length + 1,
      cantidad: parseInt(valueInsumos.cantidad),
    };
    setItemValue({ ...itemValue, ingredientes: [...itemValue.ingredientes, parse] });
    setValueInsumo({ ...valueInsumos, cantidad: 1 });
    setInsumosByCategorie([]);
  };

  const handleDeleteIngredient = () => {
    setItemValue({
      ...itemValue,
      ingredientes: itemValue.ingredientes.filter((_el, index) => index !== deleteIndex),
    });
    setDialogOpen(false);
  };

   //eliminamos un ingrediente
   const deleteIngredient = (indice: number) => {
    setItemValue({
      ...itemValue,
      ingredientes: itemValue.ingredientes.filter(
        (_el, index) => index !== indice
      ),
    });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { denominacion: "", categoria: "", precioVenta: "", tiempoEstimadoMinutos: "", descripción: "", receta: "" };

    if (!itemValue.denominacion.trim()) {
      newErrors.denominacion = "El nombre es requerido";
      valid = false;
    }
    if (itemValue.categoria.id === "0") {
      newErrors.categoria = "Debe seleccionar una categoría";
      valid = false;
    }
    if (itemValue.precioVenta <= 0) {
      newErrors.precioVenta = "El precio debe ser mayor a 0";
      valid = false;
    }
    if (itemValue.tiempoEstimadoMinutos <= 0) {
      newErrors.tiempoEstimadoMinutos = "El tiempo debe ser mayor a 0";
      valid = false;
    }
    if (itemValue.ingredientes.length === 0) {
      alert("Debe agregar al menos un ingrediente");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await productoManufacturadoService.post(itemValue);
    if (response) {
      handleClose();
      getData();
      setItemValue({
        id: "0",
        alta: true,
        categoria: {
          id: "0",
          denominacion: "Seleccione una categoria",
          categorias_hijas: null,
        },
        denominacion: "",
        precioVenta: 100,
        tiempoEstimadoMinutos: 10,
        descripción: "",
        receta: "",
        ingredientes: [],
      });
    }
  };

  useEffect(() => {
    if (open) {
      categoriaComidaService.getAll().then((data) => setCategoriaComidas(data));
      categoriaInsumosService.getAll().then((data) => setInsumosCategories(data));
    }
  }, [open]);

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.modalContainer}>
          <h2>Nuevo Artículo Manufacturado</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <TextField
                className={styles.textField}
                name="denominacion"
                label="Nombre"
                variant="outlined"
                value={itemValue.denominacion}
                onChange={(e) => setItemValue({ ...itemValue, denominacion: e.target.value })}
                error={Boolean(errors.denominacion)}
                helperText={errors.denominacion}
              />
              <Select
                className={styles.select}
                name="categoria"
                label="Categoría"
                value={itemValue.categoria.id}
                onChange={handleChangeCategorieArticuloManufacturado}
                error={Boolean(errors.categoria)}
                displayEmpty
              >
                <MenuItem value="0">Seleccione una categoría</MenuItem>
                {categoriaComidas.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.denominacion}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                className={styles.textField}
                name="precioVenta"
                label="Precio"
                variant="outlined"
                type="number"
                value={itemValue.precioVenta}
                onChange={(e) => setItemValue({ ...itemValue, precioVenta: parseFloat(e.target.value) })}
                error={Boolean(errors.precioVenta)}
                helperText={errors.precioVenta}
              />
              <TextField
                className={styles.textField}
                name="tiempoEstimadoMinutos"
                label="Tiempo estimado (minutos)"
                variant="outlined"
                type="number"
                value={itemValue.tiempoEstimadoMinutos}
                onChange={(e) => setItemValue({ ...itemValue, tiempoEstimadoMinutos: parseInt(e.target.value) })}
                error={Boolean(errors.tiempoEstimadoMinutos)}
                helperText={errors.tiempoEstimadoMinutos}
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                className={styles.textField}
                name="descripción"
                label="Descripción"
                variant="outlined"
                multiline
                rows={4}
                value={itemValue.descripción}
                onChange={(e) => setItemValue({ ...itemValue, descripción: e.target.value })}
                error={Boolean(errors.descripción)}
                helperText={errors.descripción}
              />
              <TextField
                className={styles.textField}
                name="receta"
                label="Receta"
                variant="outlined"
                multiline
                rows={4}
                value={itemValue.receta}
                onChange={(e) => setItemValue({ ...itemValue, receta: e.target.value })}
                error={Boolean(errors.receta)}
                helperText={errors.receta}
              />
            </div>
            <div className={styles.formGroup}>
              <Select
                className={styles.select}
                name="categoriaInsumo"
                value={valueInsumos.categoriaInsumo}
                onChange={handleChangeinsumosCategories}
              >
                <MenuItem value="Categoria">Categoria</MenuItem>
                {insumosCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.denominacion}>
                    {cat.denominacion}
                  </MenuItem>
                ))}
              </Select>
              <Select
                className={styles.select}
                name="ingrediente"
                value={valueInsumos.ingrediente.id}
                onChange={handleChangeInsumosValues}
              >
                <MenuItem value="0">Ingrediente</MenuItem>
                {insumosByCategorie.map((ing) => (
                  <MenuItem key={ing.id} value={ing.id}>
                    {ing.denominacion}
                  </MenuItem>
                ))}
              </Select>
              <OutlinedInput
                className={styles.input}
                name="cantidad"
                type="number"
                value={valueInsumos.cantidad}
                onChange={handleAmountInsumoValue}
                endAdornment={<InputAdornment position="end">Cantidad</InputAdornment>}
              />
              <Button variant="contained" onClick={handleNewIngredient}>
                Agregar Ingrediente
              </Button>
            </div>
            <TableIngredients
              dataIngredients={itemValue.ingredientes}
              handleDeleteItem={deleteIngredient}
            />
            <Button className={styles.submitButton} type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </form>
        </div>
      </Modal>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{"Eliminar ingrediente"}</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro de que desea eliminar este ingrediente?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteIngredient} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
