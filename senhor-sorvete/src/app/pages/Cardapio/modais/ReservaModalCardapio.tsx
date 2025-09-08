import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface ReservaModalCardapioProps {
  isModalOpen: boolean;
  closeModal: () => void;
  handleConfirm: () => void;
}

const ReservaModalCardapio = ({ isModalOpen, closeModal, handleConfirm }: ReservaModalCardapioProps) => (
  <Modal open={isModalOpen} onClose={closeModal}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        width: 400,
      }}
    >
      <h2>Reserva!</h2>
      <p>Ao confirmar, você será redirecionado para o WhatsApp para finalizar sua reserva.</p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={closeModal} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary" style={{ marginLeft: "10px" }}>
          Confirmar
        </Button>
      </div>
    </Box>
  </Modal>
);

export default ReservaModalCardapio;
