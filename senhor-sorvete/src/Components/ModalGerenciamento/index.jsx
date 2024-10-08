import React from 'react';
import { Modal, Box, Typography, TextField } from '@mui/material';
import BotaoGerenciamento from '../BotaoGerenciamento';

const estiloModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 'auto',
    maxHeight: '80vh', 
    overflowY: 'auto', 
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalGerenciamento = ({ open, onClose, title, fields, onSave }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby={`modal-${title.toLowerCase().replace(' ', '-')}`}
        >
            <Box sx={estiloModal}>
                <Typography id={`modal-${title.toLowerCase().replace(' ', '-')}`} variant="h6" component="h2" mb={2}>
                    {title}
                </Typography>
                {fields.map((field, index) => (
                    <TextField
                        key={index}
                        fullWidth
                        label={field.label}
                        type={field.type || 'text'}
                        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                        variant="outlined"
                        margin="normal"
                    />
                ))}
                <Box className="modal-button-container">
                    <BotaoGerenciamento botao="Salvar" onClick={onSave} />
                    <BotaoGerenciamento botao="Cancelar" onClick={onClose} />
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalGerenciamento;