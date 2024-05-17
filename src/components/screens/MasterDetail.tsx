import './customNavBar.css';
import { useEffect, useState } from "react";
import { MasterDetailModal } from "../ui/modals/MasterDetailModal/MasterDetailModal";
import { NavBar } from "../ui/common/NavBar";
import { SideBar } from "../ui/common/SideBar";
import { TableGeneric } from "../ui/tables/TableGeneric/TableGeneric";
import { IProductoManufacturado } from "../../types/IProductoManufacturado";
import { ProductoManufacturadoService } from "../../services/ProductoManufacturadoService";
import { useAppDispatch } from "../../hooks/redux";

import {
  removeElementActive,
  setDataTable,
} from "../../redux/slices/TablaReducer";
import { Button, CircularProgress } from "@mui/material";
// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const ColumnsProductosManufacturados = [
  { label: "ID", key: "id" },
  { label: "Nombre", key: "denominacion" },
  {
    label: "Categoria",
    key: "categoria",
    render: (element: IProductoManufacturado) => element.categoria.denominacion,
  },
  {
    label: "Tiempo de cocina",
    key: "tiempoEstimadoMinutos",
  },
  {
    label: "Habilitado",
    key: "alta",
    render: (element: IProductoManufacturado) => (element.alta ? "Si" : "No"),
  },
  {
    label: "Precio $",
    key: "precioVenta",
  },
  {
    label: "Acciones",
    key: "actions",
  },
];

export const MasterDetail = () => {
  //manejo de estado del modal
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(removeElementActive()); //al cerrar el modal siempre reseteamos el elemento activo
  };

  //instanciamos el loader de la carga de datos
  const [loading, setLoading] = useState<boolean>(false);

  //instanciamos el dispatch
  const dispatch = useAppDispatch();

  //instanciamos los servicios
  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/producto_manufacturado`
  );

  // Función para obtener los productos manufacturados
  const getDataTable = async () => {
    await productoManufacturadoService.getAll().then((dataTable) => {
      dispatch(setDataTable(dataTable));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getDataTable();
  }, []);

  //funcion para eleminar un elemento
  const handleDelete = async (id: number | string) => {
    await productoManufacturadoService.delete(id);
    dispatch(removeElementActive());
    getDataTable();
  };

  //funcion para dar de baja o alta un elemento
  const handleCancelOrRegister = async (
    id: number | string,
    data: IProductoManufacturado
  ) => {
    await productoManufacturadoService.put(id, data);
    dispatch(removeElementActive());
    getDataTable();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="navbar-fixed">
          <NavBar />
        </div>
        <div className="content-container">
        <h1 style={{ textAlign: "center", marginTop: "3rem", marginBottom: "0.1rem" }}>Productos</h1>
          <div
            style={{
              height: "10vh",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              padding: "0.4rem",
            }}
          >
          </div>
          <div style={{ flex: 1, padding: "1rem" }}>
            {!loading ? (
              <TableGeneric
                handleDelete={handleDelete}
                columns={ColumnsProductosManufacturados}
                setOpenModal={setOpenModal}
                handleCancelOrRegister={handleCancelOrRegister}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            )}
            <div className="button-container">
              <Button 
              style={{ letterSpacing: "1px", fontWeight: "bold" }}
                className="custom-button"
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
              >
                Agregar un producto manufacturado
              </Button>
            </div>
          </div>
          
        </div>
        
      </div>
      
      <MasterDetailModal
        getData={getDataTable}
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

