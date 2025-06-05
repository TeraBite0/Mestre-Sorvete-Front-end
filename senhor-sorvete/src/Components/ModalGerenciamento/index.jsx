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
  Button,
} from "@mui/material";
import BotaoGerenciamento from "../BotaoGerenciamento";
import ModalAdicionarFornecedor from "../../Components/ModalAdicionarFornecedor";
import axios from "axios";
import { toast } from "react-toastify";


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
  dadosEmComun,
  onSave,
  onSubmit = null,
  loading = false,
  validation = {},
  transformBeforeSubmit = (data) => data,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [abrirAdicionarFornecedor, setAbrirAdicionarFornecedor] = useState(false);
  const [localFields, setLocalFields] = useState(fields);
  const [produtos, setProdutos] = useState([]);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (open) {
      setFormData({});
      setLocalFields(fields);
      buscarProdutos();
      setErrors({});
    }
  }, [open, fields]);

  const buscarProdutos = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.get('http://50.19.70.8:8080/produtos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProdutos(response.data);
    } catch (error) {
      toast.error('Erro ao buscar estoque');
      console.log(error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    if (value === "add-new") {
      abrirModalAdicionarFornecedor();
      return;
    }
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

  const abrirModalAdicionarFornecedor = () => setAbrirAdicionarFornecedor(true);

  const fecharModalAdicionarFornecedor = () => {
    setAbrirAdicionarFornecedor(false)
    onClose()
  };

  const validateFields = () => {
    const newErrors = {};
    localFields.forEach((field) => {
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

    const transformedData = transformBeforeSubmit(formData, index);

    if (onSubmit) {
      await onSubmit(transformedData);
    } else if (onSave) {
      onSave(transformedData);
    }
  };

  const handleAdicionarCampo = () => {
    setIndex(index + 1);
    setLocalFields([...localFields, {
      name: `produto${index}`,
      label: `Produto`,
      type: "select",
      options: produtos.map((p) => ({
        value: p.codigo || p.id,
        label: `${p.nome || p.produto} - ${p.marca}`,
      })),
    },
    {
      name: `qtdCaixasCompradas${index}`,
      label: "Quantidade de caixas comprada",
      type: "number",
    }]);
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
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby={`modal-${title.toLowerCase().replace(" ", "-")}`}
      >
        <Box sx={estiloModal}
          style={{ width: "1100px", height: "400px" }}>
          <Typography
            id={`modal-${title.toLowerCase().replace(" ", "-")}`}
            variant="h6"
            component="h2"
            mb={2}
          >
            {title}
          </Typography>

          <div style={{ display: "flex", gap: "20px", justifyContent: "space-evenly" }}>
            <div style={{ height: "330px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div
                style={{
                  height: "250px",
                  width: "450px",
                  marginBottom: "20px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  overflowY: "scroll"
                }}>

                {localFields.map((field) => renderField(field))}

              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="outlined" onClick={handleAdicionarCampo}>
                  Add produto
                </Button>
              </div>
            </div>
            <div style={{ height: "330px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {dadosEmComun.map((field) => renderField(field))}
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
            </div>

          </div>


        </Box>
      </Modal>

      <ModalAdicionarFornecedor
        open={abrirAdicionarFornecedor}
        onClose={fecharModalAdicionarFornecedor}
        title="Adicionar Fornecedor"
      />
    </>
  );

};

export default ModalGerenciamento;
