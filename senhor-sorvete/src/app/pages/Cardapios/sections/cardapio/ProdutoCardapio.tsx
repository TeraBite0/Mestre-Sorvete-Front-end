import "./produtoCardapio.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import "primereact/resources/primereact.min.css";
import { RootState } from "../../../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { setListaProdutosAtivos, setMinhaLista, setProdutosFiltrados } from "../../../../../store/slices/produtos";

const ListaProdutosCardapioSection = () => {
  const dispatch = useDispatch();
  const { listaProdutosAtivos, produtosFiltrados, minhaLista } = useSelector( (state: RootState) => state.produtos );

  const produtos = produtosFiltrados.length > 0 ? produtosFiltrados : listaProdutosAtivos;

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

  const toggleMinhaLista = (produto: any) => {
    const produtoAtualizado = { ...produto, isMinhaLista: !produto.isMinhaLista };

    const atualizarLista = (lista: any[]) => lista.map((p) => (p.id === produto.id ? produtoAtualizado : p));

    dispatch(setListaProdutosAtivos(atualizarLista(listaProdutosAtivos)));
    dispatch(setProdutosFiltrados(atualizarLista(produtosFiltrados)));

    if (produtoAtualizado.isMinhaLista) {
      dispatch(setMinhaLista([...minhaLista, produtoAtualizado]));
    } else {
      dispatch(setMinhaLista(minhaLista.filter((p) => p.id !== produto.id)));
    }
  };

  return (
    <div className="container-prod-cardapio">
      <div className="products">
        {produtos.map((produto) => (
          <div className="product" key={produto.id}>
            <div className="im-prod-cardapio">
              <img
                src={produto.imagemUrl}
                alt={produto.nome}
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

              <Button
                label="Salvar na lista"
                style={{ fontSize: "12px", backgroundColor: produto.isMinhaLista ? "green" : "" }}
                icon={produto.isMinhaLista ? "pi pi-heart-fill" : "pi pi-heart"}
                onClick={() => toggleMinhaLista(produto)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaProdutosCardapioSection;