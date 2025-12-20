import "./CarrinhoModalCardapio.css";
import { useSelector } from "react-redux";
import "./CarrinhoModalCardapio.css";
import { Dialog } from "primereact/dialog";
import "primeflex/primeflex.css";

interface CartItem {
  id: string | number;
  imagemUrl: string;
  nome: string;
  preco: number;
  quantity?: number;
}

interface CarrinhoModalCardapioProps {
  isModalOpen: boolean;
  closeModal: () => void;
}
const CarrinhoModalCardapio = ({ isModalOpen, closeModal }: CarrinhoModalCardapioProps) => {
  const carrinho = useSelector((state: any) => state.produtos.minhaLista);

  const calcularTotalGeral = () => {
    return carrinho.reduce((total: number, item: CartItem) => { return total + item.preco * (item.quantity || 1); }, 0).toFixed(2);
  };

  const headerCarrinho = () => {
    return (
      <>
        <span className="">
          <span className="">Minha lista 🍦 📕</span>
          <span className="flex align-items-center mt-2" style={{ fontSize: "0.8rem", color: "red" }}>Lista inteiramente ilustrativa *</span>
        </span>
      </>
    );
  };

  return (
    <Dialog
      header={headerCarrinho()}
      visible={isModalOpen}
      style={{ width: "90vw", maxWidth: "500px" }}
      onHide={closeModal}
      closable
      draggable={false}
      resizable={false}
      modal
      dismissableMask
    >
      <div style={{ maxHeight: "35vh", overflowY: "auto" }} >
        {carrinho.length === 0 ? (
          <p className="empty-cart">Nenhum produto na lista</p>
        ) : (
          <ul className="cart-list">
            {carrinho.map((item: CartItem) => (
              <li key={item.id} className="cart-item">
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
                  <p className="cart-total">
                    R$ {(item.preco * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {carrinho.length > 0 && (
        <div className="cart-summary">
          <h4>Quantidade de produto: {carrinho.length}</h4>
          <strong>Valor total: R$ {calcularTotalGeral()}</strong>
        </div>
      )}
    </Dialog>
  );
};

export default CarrinhoModalCardapio;