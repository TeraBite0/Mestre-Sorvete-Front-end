import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "./CarrinhoModalCardapio.css";
import { useSelector } from "react-redux";
import useCardapio from "../../hooks/useCardapio";

interface CarrinhoModalCardapioProps {
  isModalOpen: boolean;
  closeModal: () => void;
  cartItems: any[];
}

const CarrinhoModalCardapio = ({
  isModalOpen,
  closeModal,
  cartItems,
}: CarrinhoModalCardapioProps) => {
  const calcularTotalGeral = () => {
    return cartItems
      .reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
      .toFixed(2);
  };
  const cardapio = useCardapio();

  const carrinho = cardapio.cartItems;
  useEffect(() => {
    console.log("Itens no carrinho:", cardapio.cartItems);
  } , [carrinho]);

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 20,
          padding: "10px 0 20px 0",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#4E342E",
          fontSize: "1.6rem",
        }}
      >
        Carrinho de Reservas 🍦
      </DialogTitle>

      <DialogContent dividers>
        {carrinho.length === 0 ? (
          <p className="empty-cart">Nenhum item adicionado ainda</p>
        ) : (
          <ul className="cart-list">
            {carrinho.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={item.imagemUrl}
                  alt={item.nome}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "Imagens/sorvete-baunilha.jpg";
                    target.alt = "Imagem genérica do produto";
                  }}
                  className="cart-img"
                />

                <div className="cart-details">
                  <h4>{item.nome}</h4>
                  <div className="cart-quantity">
                    <button className="qty-btn">-</button>
                    <span>{item.quantity || 1}</span>
                    <button className="qty-btn">+</button>
                  </div>
                  <p className="cart-total">
                    Total: R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>

      {carrinho.length > 0 && (
        <div className="cart-summary">
          <h3>Total da Reserva:</h3>
          <strong>R$ {calcularTotalGeral()}</strong>
        </div>
      )}

      <DialogActions sx={{ justifyContent: "flex-end", padding: "10px 24px" }}>
        <Button onClick={closeModal} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ marginLeft: "10px" }}
        >
          Confirmar Reserva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrinhoModalCardapio;
