import {
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import styles from "./ViewDetailModal.module.css"; // Asegúrate de importar el CSS
import { useAppSelector } from "../../../../hooks/redux";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import '../../../screens/customNavBar.css';

interface IViewDetailModal {
  open: boolean;
  handleClose: () => void;
}

const initialValues: IProductoManufacturado = {
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
};

export const ViewDetailModal: FC<IViewDetailModal> = ({ handleClose, open }) => {
  const [itemValue, setItemValue] = useState(initialValues);

  const data = useAppSelector((state) => state.tablaReducer.elementActive);

  useEffect(() => {
    if (data) {
      setItemValue({
        id: data.id,
        categoria: data.categoria,
        denominacion: data.denominacion,
        alta: data.alta,
        precioVenta: data.precioVenta,
        tiempoEstimadoMinutos: data.tiempoEstimadoMinutos,
        descripción: data.descripción,
        receta: data.receta,
        ingredientes: data.ingredientes,
      });
    } else {
      setItemValue(initialValues);
    }
  }, [data]);

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
            <div style={{ textAlign: "center", backgroundColor: "#a6c732" }}>
              <h1 style={{ letterSpacing: "2px", fontWeight: "bold" }}>Detalle del Producto</h1>
            </div>
            <div className={styles.productContainer}>
              <div className={styles.productContainerInputs}>
                <div className={styles.productContainerRow}>
                  <label>
                    Categoría
                    <TextField
                      value={itemValue.categoria.denominacion}
                      variant="standard"
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                  <label>
                    Nombre
                    <TextField
                      value={itemValue.denominacion}
                      variant="standard"
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                  <label>
                    Precio
                    <TextField
                      value={itemValue.precioVenta}
                      variant="standard"
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                  <label>
                    Tiempo estimado de preparación
                    <TextField
                      value={itemValue.tiempoEstimadoMinutos}
                      variant="standard"
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                </div>
                <div className={styles.descriptionContainer}>
                  <label>
                    Descripción
                    <TextField
                      value={itemValue.descripción}
                      variant="outlined"
                      multiline
                      rows={4}
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                </div>
                <div className={styles.recipeContainer}>
                  <label>
                    Receta
                    <TextField
                      value={itemValue.receta}
                      variant="outlined"
                      multiline
                      rows={4}
                      disabled
                      fullWidth
                      InputProps={{ className: styles.textField }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.ingredientesTableContainer}>
              {itemValue.ingredientes.length > 0 && (
                <div className={styles.ingredientesTableContainerItem}>
                  <h3>Ingredientes:</h3>
                  <ul className={styles.ingredientesList}>
                    {itemValue.ingredientes.map((ing, index) => (
                      <li key={index} className={styles.ingredientesListItem}>
                        {`${ing.denominacion} - ${ing.cantidad} ${ing.unidadMedida.abreviatura}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.button}
                  variant="contained"
                  onClick={handleClose}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
