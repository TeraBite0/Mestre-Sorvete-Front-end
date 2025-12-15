import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface FiltroCategoriaModalProps {
  isMaisModalOpen: boolean;
  closeMaisModal: () => void;
}

const FiltroCategoriaModal = ({ isMaisModalOpen, closeMaisModal }: FiltroCategoriaModalProps) => (
  <Modal open={isMaisModalOpen} onClose={closeMaisModal}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        width: { xs: "80%", sm: 400, md: 500 },
      }}
    >
      <h2>Filtrar por Categoria</h2>
    </Box>
  </Modal>
);

export default FiltroCategoriaModal;
