import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import BotaoGerenciamento from "../BotaoGerenciamento";

const estiloModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalGerenciamento = ({
  open,
  onClose,
  title,
  fields,
  onSave,
  onSubmit = null,
  loading = false,
  validation = {},
  transformBeforeSubmit = (data) => data,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({});
      setErrors({});
    }
  }, [open]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const fieldValidation = validation[field.name];
      if (fieldValidation) {
        const value = formData[field.name];
        if (fieldValidation.required && !value) {
          newErrors[field.name] = "Campo obrigatório";
        } else if (
          fieldValidation.pattern &&
          !fieldValidation.pattern.test(value)
        ) {
          newErrors[field.name] = fieldValidation.message || "Valor inválido";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    const transformedData = transformBeforeSubmit(formData);

    if (onSubmit) {
      await onSubmit(transformedData);
    } else if (onSave) {
      onSave(transformedData);
    }
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <FormControl
          key={field.name}
          fullWidth
          margin="normal"
          error={!!errors[field.name]}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            label={field.label}
            disabled={loading}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors[field.name] && (
            <FormHelperText>{errors[field.name]}</FormHelperText>
          )}
        </FormControl>
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        label={field.label}
        name={field.name}
        type={field.type || "text"}
        value={formData[field.name] || ""}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        error={!!errors[field.name]}
        helperText={errors[field.name]}
        InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
        variant="outlined"
        margin="normal"
        disabled={loading}
        {...field.props}
      />
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={`modal-${title.toLowerCase().replace(" ", "-")}`}
    >
      <Box sx={estiloModal}>
        <Typography
          id={`modal-${title.toLowerCase().replace(" ", "-")}`}
          variant="h6"
          component="h2"
          mb={2}
        >
          {title}
        </Typography>

        {fields.map((field) => renderField(field))}

        <Box className="modal-button-container">
          <BotaoGerenciamento
            botao="Cancelar"
            onClick={onClose}
            disabled={loading}
          />
          <BotaoGerenciamento
            botao="Salvar"
            onClick={handleSave}
            disabled={loading}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalGerenciamento;
