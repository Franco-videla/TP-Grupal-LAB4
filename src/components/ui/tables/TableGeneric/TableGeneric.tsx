import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { ButtonsTable } from "../../buttons/ButtonsTable/ButtonsTable";
import { useAppSelector } from "../../../../hooks/redux";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";

// Definimos la interfaz para cada columna de la tabla
interface ITableColumn<T> {
  label: string; // Etiqueta de la columna
  key: string; // Clave que corresponde a la propiedad del objeto en los datos
  render?: (item: T) => React.ReactNode; // Función opcional para personalizar la renderización del contenido de la celda
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[]; // Definición de las columnas de la tabla
  setOpenModal: (state: boolean) => void;
  handleCancelOrRegister: (
    id: number | string,
    data: IProductoManufacturado
  ) => void;
  searchTerm: string; // Añadimos searchTerm como una propiedad
}

export const TableGeneric = <T extends { id: any }>({
  columns,
  setOpenModal,
  handleCancelOrRegister,
  searchTerm, // Añadimos searchTerm
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Función para cambiar de página
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Función para cambiar el número de filas por página
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Estado para almacenar las filas de la tabla
  const [rows, setRows] = useState<any[]>([]);

  // Obtener los datos de la tabla del estado global
  const dataTable = useAppSelector((state) => state.tablaReducer.dataTable);

  // Actualizar las filas cuando cambien los datos de la tabla
  useEffect(() => {
    setRows(dataTable);
  }, [dataTable]);

  // Filtrar las filas según el término de búsqueda
  const filteredRows = rows.filter((row) =>
    columns.some((column) =>
      row[column.key]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0", // Fondo gris claro
        padding: "20px", // Espaciado interno
        borderRadius: "10px", // Bordes redondeados
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Sombra sutil
        margin: "5px 0" // Margen superior e inferior
      }}
    >
      {/* Contenedor del componente Paper */}
      <Paper sx={{ width: "200%", overflow: "hidden", background : "#e0ebc2" }}>
        {/* Contenedor de la tabla */}
        <TableContainer sx={{ maxHeight: "80vh", background : "#e0ebc2" }}>
          {/* Tabla */}
          <Table stickyHeader aria-label="sticky table">
            {/* Encabezado de la tabla */}
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell key={i} align={"center"} sx={{ backgroundColor: '#a6c732' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/* Cuerpo de la tabla */}
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: number) => {
                  return (
                    <TableRow role="checkbox" tabIndex={-1} key={index}>
                      {/* Celdas de la fila */}
                      {columns.map((column, i: number) => {
                        return (
                          <TableCell key={i} align={"center"}>
                            {
                              column.render ? ( // Si existe la función "render" se ejecuta
                                column.render(row)
                              ) : column.label === "Acciones" ? ( // Si el label de la columna es "Acciones" se renderizan los botones de acción
                                <ButtonsTable
                                  el={row}
                                  setOpenModal={setOpenModal}
                                  handleCancelOrRegister={handleCancelOrRegister}
                                />
                              ) : (
                                row[column.key]
                              ) // Si no hay una función personalizada, se renderiza el contenido de la celda tal cual
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Paginación de la tabla */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
