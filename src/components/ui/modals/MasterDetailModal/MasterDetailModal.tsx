import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import styles from "./MasterDetailModal.module.css";
import { TableIngredients } from "../../tables/TableIngredients/TableIngredients";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { IInsumo } from "../../../../types/IInsumo";
import { categorias } from "../../../../types/Icategorias";
import { CategoriaComidaService } from "../../../../services/CategoriaComidaService";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { InsumoServices } from "../../../../services/InsumosServices";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import { handleSuccess } from "../../../../helpers/alerts";

const API_URL = import.meta.env.VITE_API_URL;

// Valores iniciales del modal
const initialValues: IProductoManufacturado = {
  id: "",
  alta: true,
  categoria: {
    id: 0,
    denominacion: "Seleccione una categoria",
    categorias_hijas: null,
  },
  denominacion: "",
  precioVenta: 100,
  tiempoEstimadoMinutos: 10,
  descripción: "",
  receta: "",
  ingredientes: [],
};

const initialIngredients = {
  categoriaInsumo: "Categoria",
  ingrediente: {
    id: 0,
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
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const MasterDetailModal: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  // Propiedades artículo manufacturado
  const [itemValue, setItemValue] = useState<IProductoManufacturado>(initialValues);
  const [error, setError] = useState<string | null>(null);

  const resetValues = () => {
    setItemValue(initialValues);
  };

  // Maneja los cambios de los inputs del artículo manufacturado (nombre, precio, tiempo, descripción, receta)
  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Categorías del apartado comida
  const [categoriaComidas, setcategoriaComidas] = useState<categorias[]>([]);

  // Realiza el cambio de categoría en artículo manufacturado
  const handleChangeCategorieArticuloManufacturado = async (
    e: SelectChangeEvent<string>
  ) => {
    const denominacion = e.target.value;
    const res = await categoriaComidaService.getById(denominacion);
    if (res) {
      setItemValue((prevState) => ({ ...prevState, categoria: res }));
    }
  };

  // Ingredientes del artículo manufacturado
  const [valueInsumos, setvaluesInsumo] = useState<typeof initialIngredients>(initialIngredients);
  const resetValueInsumos = () => {
    setvaluesInsumo(initialIngredients);
  };

  // Categorías del apartado insumos
  const [insumosCategories, setInsumosCategories] = useState<categorias[]>([]);
  const [insumosByCategorie, setInsumosByCategorie] = useState<IInsumo[]>([]);

  // Selecciona una categoría del apartado insumos y se setean todos los ingredientes que vayan con ella
  const handleChangeinsumosCategories = async (e: SelectChangeEvent<string>) => {
    const insumos = await insumosServices.getAll();
    const denominacion = e.target.value;
    setvaluesInsumo((prevState) => ({ ...prevState, categoriaInsumo: denominacion }));
    const result = insumos.filter(
      (el) => el.categoria.denominacion === denominacion
    );
    setInsumosByCategorie(result);
  };

  // Realiza el cambio del ingrediente actual
  const handleChangeInsumosValues = async (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    const res = await insumosServices.getById(value);
    if (res) {
      setvaluesInsumo((prevState) => ({
        ...prevState,
        ingrediente: res,
      }));
    }
  };

  // Realiza el cambio de la cantidad del ingrediente
  const handleAmountInsumoValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setvaluesInsumo((prevState) => ({ ...prevState, cantidad: parseInt(value) }));
  };

  // Añade un nuevo ingrediente a nuestro artículo manufacturado
  const handleNewIngredient = () => {
    const parse = {
      ...valueInsumos.ingrediente,
      id: itemValue.ingredientes.length + 1, // Convertir el ID a string
      cantidad: valueInsumos.cantidad,
    };
    setItemValue((prevState) => ({
      ...prevState,
      ingredientes: [...prevState.ingredientes, parse as IInsumo],
    }));
    resetValueInsumos();
    setInsumosByCategorie([]);
  };

  // Elimina un ingrediente
  const deleteIngredient = (indice: number) => {
    setItemValue((prevState) => ({
      ...prevState,
      ingredientes: prevState.ingredientes.filter((_, index) => index !== indice),
    }));
  };

  // Lógica del modal
  const amountItems = useAppSelector(
    (state) => state.tablaReducer.dataTable.length
  );

  // Si se confirma, edita o agrega un nuevo elemento
  const handleConfirmModal = async () => {
    // Validaciones
    if (itemValue.denominacion.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }
    if (itemValue.categoria.id === 0) {
      setError("Debe seleccionar una categoría");
      return;
    }
    if (itemValue.tiempoEstimadoMinutos <= 0) {
      setError("El tiempo estimado debe ser mayor a 0");
      return;
    }
    if (itemValue.precioVenta < 0) {
      setError("El precio no puede ser negativo");
      return;
    }
    if (itemValue.ingredientes.length === 0) {
      setError("Debe agregar al menos un ingrediente");
      return;
    }

    setError(null); // Limpiar errores si todas las validaciones pasan

    if (data) {
      await productoManufacturadoService.put(data.id.toString(), itemValue);
    } else {
      const newId = (amountItems + 1).toString();
      const parseNewId = { ...itemValue, id: newId };
      await productoManufacturadoService.post(parseNewId);
    }
    handleSuccess("Elemento guardado correctamente");
    handleClose();
    resetValues();
    getData(); // Trae nuevamente los elementos
    dispatch(removeElementActive()); // Remueve el activo
  };

  // Redux
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);

  // Servicios
  const categoriaComidaService = new CategoriaComidaService(
    `${API_URL}/categorias_comida`
  );

  const categoriaInsumosService = new CategoriaComidaService(
    `${API_URL}/categorias_insumos`
  );

  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/producto_manufacturado`
  );

  const insumosServices = new InsumoServices(`${API_URL}/insumos`);

  // Funciones para traer los elementos
  const getCategoriasInsumos = async () => {
    const data = await categoriaInsumosService.getAll();
    setInsumosCategories(data);
  };

  const getCategories = async () => {
    const data = await categoriaComidaService.getAll();
    setcategoriaComidas(data);
  };

  useEffect(() => {
    if (data) {
      setItemValue(data);
    } else {
      resetValues();
    }
  }, [data]);

  useEffect(() => {
    getCategories();
    getCategoriasInsumos();
  }, []);

  const isAddButtonDisabled = valueInsumos.categoriaInsumo === "Categoria" || valueInsumos.ingrediente.denominacion === "Ingrediente";

  return (
    <div>
      <Modal
        open={open}
        style={{ zIndex: 200 }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalContainerContent}>
            <div style={{ textAlign: "center" }}>
              <h1>{`${data ? "Editar" : "Crear"} un producto manufacturado`}</h1>
            </div>

            <div className={styles.productContainer}>
              <div className={styles.productContainerInputs}>
                <Select
                  variant="filled"
                  value={itemValue.categoria.id.toString()} 
                  onChange={handleChangeCategorieArticuloManufacturado}
                >
                  <MenuItem value={"0"}>Seleccione una categoria</MenuItem>
                  {categoriaComidas.map((el, index) => (
                    <MenuItem key={index} value={el.id.toString()}> 
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Nombre"
                  type="text"
                  name="denominacion"
                  onChange={handlePropsElementsInputs}
                  value={itemValue.denominacion}
                  variant="filled"
                />
                <TextField
                  type="number"
                  value={itemValue.precioVenta}
                  onChange={handlePropsElementsInputs}
                  name="precioVenta"
                  label="Precio"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  type="number"
                  onChange={handlePropsElementsInputs}
                  name="tiempoEstimadoMinutos"
                  value={itemValue.tiempoEstimadoMinutos}
                  label="Tiempo estimado de preparacion"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  onChange={handlePropsElementsInputs}
                  label="Descripción"
                  type="text"
                  value={itemValue.descripción}
                  name="descripción"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
            </div>
            <div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingresa la receta</h1>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                <TextField
                  style={{ width: "90%" }}
                  label="Receta"
                  type="text"
                  value={itemValue.receta}
                  onChange={handlePropsElementsInputs}
                  name="receta"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingredientes</h1>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                <Select
                  variant="filled"
                  value={valueInsumos.categoriaInsumo}
                  label="Categoria"
                  onChange={handleChangeinsumosCategories}
                >
                  <MenuItem value={"Categoria"}>Categoria</MenuItem>
                  {insumosCategories.map((el, index) => (
                    <MenuItem key={index} value={el.denominacion}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  variant="filled"
                  label="Ingrediente"
                  name="Ingrediente"
                  value={valueInsumos.ingrediente.id.toString()} 
                  onChange={handleChangeInsumosValues}
                >
                  <MenuItem value={"0"}>Ingrediente</MenuItem>
                  {insumosByCategorie.map((el) => (
                    <MenuItem key={el.id} value={el.id.toString()}> 
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                {valueInsumos.ingrediente.denominacion !== "Ingrediente" && (
                  <TextField
                    type="text"
                    label={valueInsumos.ingrediente.unidadMedida.denominacion}
                    value={valueInsumos.ingrediente.unidadMedida.abreviatura}
                    variant="filled"
                    disabled
                  />
                )}
                <TextField
                  type="number"
                  name="cantidad"
                  label="Ingrese Cantidad"
                  onChange={handleAmountInsumoValue}
                  value={valueInsumos.cantidad}
                  variant="filled"
                  defaultValue={10}
                />
                <Button onClick={handleNewIngredient} variant="text" disabled={isAddButtonDisabled}>
                  Añadir
                </Button>
              </div>
            </div>
            <div className={styles.ingredientesTableContainer}>
              {itemValue.ingredientes.length > 0 && (
                <div className={styles.ingredientesTableContainerItem}>
                  <TableIngredients
                    dataIngredients={itemValue.ingredientes}
                    handleDeleteItem={deleteIngredient}
                  />
                </div>
              )}
              {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar Modal
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmModal}
                  disabled={
                    !itemValue.denominacion.trim() ||
                    itemValue.categoria.id === 0 ||
                    itemValue.tiempoEstimadoMinutos <= 0 ||
                    itemValue.precioVenta < 0 ||
                    itemValue.ingredientes.length === 0
                  }
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
