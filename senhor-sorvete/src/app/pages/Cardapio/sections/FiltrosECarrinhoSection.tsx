// import Filtros from "../../../shared/components/Filtros/Filtro";
import { CartItem } from "../types/types";

type FiltrosECarrinhoProps = {
  priceRange: number;
  setPriceRange: (value: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  openModal: () => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>; // ✅ aqui
};

const FiltrosECarrinho = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
  cartItems,
  addToCart,
  removeFromCart,
  openModal,
  sidebarRef,
}: FiltrosECarrinhoProps) => (
  <div className="sidebarWrapper" ref={sidebarRef}>
    {/*
      Filtro não está funcionando, descomentar quando for arrumar
    */}
    {/* <aside className="sidebar">
      <Filtros
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        category={selectedCategories.length > 0 ? selectedCategories[0] : ""}
        type={selectedTypes.length > 0 ? selectedTypes[0] : ""}
      />
    </aside> */}
    <aside className="reserva">
      <h2>Reservas</h2>
      {cartItems.length === 0 ? (
        <p style={{
          color: "#888",
          textAlign: "center",
          fontStyle: "italic",
          padding: "20px",
        }}>
          Nenhum item adicionado ainda
        </p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <img
                  src={item.imagemUrl}
                  alt={item.nome}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "Imagens/sorvete-baunilha.jpg";
                    target.alt = "Imagem genérica do produto";
                  }}
                />
                <div className="cartItemDetails">
                  <h4>{item.nome}</h4>
                  <div className="quantityWrapper">
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  <p>Total: R$ {(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="checkoutButton" onClick={openModal}>
            Realizar Reserva
          </button>
        </>
      )}
    </aside>
  </div>
);

export default FiltrosECarrinho;
