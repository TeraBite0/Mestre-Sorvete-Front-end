import Skeleton from "@mui/material/Skeleton";
import ProdutoCardapioItemSection from "./ProdutoCardapioItemSection";

interface ListaProdutosCardapioSectionProps {
  produtos: any[];
  isLoading: boolean;
  addToCart: (produto: any) => void;
}

const ListaProdutosCardapioSection = ({ produtos, isLoading, addToCart }: ListaProdutosCardapioSectionProps) => {
  if (isLoading) {
    return Array.from(new Array(6)).map((_, index) => (
      <div key={index} className="product">
        <Skeleton variant="rectangular" width="100%" height={160} className="mb-4" />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    ));
  }

  if (produtos.length === 0) {
    return (
      <div className="error-message">
        <p style={{
          color: "#8B4513",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "rgba(245, 245, 220, 0.6)",
          borderRadius: "10px",
          width: "50rem",
        }}>
          O conteúdo não pôde ser carregado. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return produtos.map((produto, index) => (
    <ProdutoCardapioItemSection key={index} produto={produto} addToCart={addToCart} />
  ));
};

export default ListaProdutosCardapioSection;
