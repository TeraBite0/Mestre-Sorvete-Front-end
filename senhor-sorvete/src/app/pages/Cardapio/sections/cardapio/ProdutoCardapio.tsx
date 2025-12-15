import React from "react";
import Skeleton from "@mui/material/Skeleton";
// import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./produtoCardapio.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import useProdutoCardapio from "./hook/useProdutoCardapio";

interface ListaProdutosCardapioSectionProps {
  isLoading: boolean;
  addToCart: (produto: any) => void;
}

const ListaProdutosCardapioSection: React.FC<ListaProdutosCardapioSectionProps> = ({
  isLoading,
  addToCart,
}) => {
  useProdutoCardapio();
  const produtos = useSelector((state: RootState) => {
    const { listaProdutosAtivos, produtosFiltrados } = state.produtos;
    return produtosFiltrados.length > 0 ? produtosFiltrados : listaProdutosAtivos;
  });

  const ProdutoCardapioItemSection: React.FC<{ 
    produto: any; 
    addToCart: (produto: any) => void; }> = ({ produto, addToCart }) =>
  (
    <div className="product">
      <div className="im-prod-cardapio">
        <img
          src={produto.imagemUrl}
          alt={`${produto.nome} Ice Cream`}
          className="w-full h-48 object-cover rounded-2xl mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "Imagens/404-icon.webp";
            target.alt = "Erro na imagem";
          }}
        />
      </div>

      <div className="card-prod-cardapio">
        <div className="product-name" title={produto.nome}>
          {produto.nome}
        </div>
        <p>R$ {produto.preco.toFixed(2)}</p>
      </div>

      {/* <div className="botao-comprar">
        <Button
          icon="pi pi-shopping-cart"
          className="p-button-success botaoPesquisa"
          onClick={() => addToCart(produto)}
        />
      </div> */}
    </div>
  );


  if (isLoading) {
    return (
      <>
        {Array.from(new Array(6)).map((_, index) => (
          <div key={index} className="product">
            <Skeleton variant="rectangular" width="100%" height={160} className="mb-4" />
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </div>
        ))}
      </>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="error-message">
        <p
          style={{
            color: "#8B4513",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(245, 245, 220, 0.6)",
            borderRadius: "10px",
            width: "50rem",
          }}
        >
          O conteúdo não pôde ser carregado. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <>
      
        <div className="container-prod-cardapio">
          <div className="products">
            {produtos.map((produto, index) => (
              <ProdutoCardapioItemSection
                key={index}
                produto={produto}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      
    </>
  );
};

export default ListaProdutosCardapioSection;
