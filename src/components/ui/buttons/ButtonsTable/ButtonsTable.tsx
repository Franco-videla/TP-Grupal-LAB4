import { Button } from "@mui/material";
import { useAppDispatch } from "../../../../hooks/redux";
import { setElementActive } from "../../../../redux/slices/TablaReducer";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import { handleConfirm } from "../../../../helpers/alerts";
import { useState } from "react";
import { ViewDetailModal } from "../../modals/ViewDetailModal/ViewDetailModal"; // Importa el nuevo modal

interface IButtonsTable {
  el: IProductoManufacturado;
  
  setOpenModal: (state: boolean) => void;
  handleCancelOrRegister: (id: number | string, el: IProductoManufacturado) => void;
}

export const ButtonsTable = ({
  el,
  setOpenModal,
  handleCancelOrRegister,
}: IButtonsTable) => {
  const dispatch = useAppDispatch();
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const handleModalSelected = () => {
    dispatch(setElementActive({ element: el }));
    setOpenModal(true);
  };

  

  const handleChangeRegisterOrCancelItem = () => {
    handleCancelOrRegister(el.id, { ...el, alta: !el.alta });
  };

  const handleViewDetails = () => {
    dispatch(setElementActive({ element: el }));
    setOpenDetailModal(true);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
      {el.alta === true ? (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          variant="contained"
          sx={{ backgroundColor: '#dd5555', color: 'white', '&:hover': { backgroundColor: '#d82727' } }}
        >
          Deshabilitar
        </Button>
      ) : (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          variant="contained"
          sx={{ backgroundColor: '#a6c732', color: 'white', '&:hover': { backgroundColor: '#9cc40f' } }}
        >
          Habilitar
        </Button>
      )}
      <Button variant="contained" onClick={handleModalSelected}>
        <span className="material-symbols-outlined">edit</span>
      </Button>
      <Button variant="contained" onClick={handleViewDetails}>
        <span className="material-symbols-outlined">visibility</span>
      </Button>
      <ViewDetailModal open={openDetailModal} handleClose={() => setOpenDetailModal(false)} />
    </div>
  );
};
