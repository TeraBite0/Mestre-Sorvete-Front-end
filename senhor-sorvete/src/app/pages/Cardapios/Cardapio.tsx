import "./cardapio.css";
import useCardapio from "./hooks/useCardapio";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import ProdutoSearchBarSection from "./sections/produtoSearchBar/ProdutoSearchBarSection";
import ListaProdutosCardapioSection from "./sections/cardapio/ProdutoCardapio";

const Cardapio = () => { useCardapio();

  return (
    <div className="containerCardapio">
      <Header />

      <nav className="navegacao">
        <ProdutoSearchBarSection  />
      </nav>

      
      <div>
        <ListaProdutosCardapioSection />
      </div>

      <Footer />
    </div>
  );
};

export default Cardapio;
