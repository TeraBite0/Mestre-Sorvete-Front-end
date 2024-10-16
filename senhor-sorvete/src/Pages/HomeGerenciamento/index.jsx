import HeaderGerencimento from "../../Components/HeaderGerenciamento";
import CardsGerenciamento from "../../Components/CardsGerenciamento";
import "./homeGerenciamento.css";

const HomeGerenciamento = () => {
  let imagens = [
    <img src="/Imagens/velocimetro.png" />,
    <img src="/Imagens/list-icon.png" />,
    <img src="/Imagens/calendario-icon.png" />,
    <img src="/Imagens/estoque-icon.png" />,
    <img src="/Imagens/vendas-icon.png" />,
    <img src="/Imagens/retornar-site.png" />  
  ];

  return (
    <div>
      <HeaderGerencimento />

      <div className="containerFerramentas">
        <h2>Ferramentas</h2>
      </div>

      <div className="ferramentas">
        <div className="cards-rumo">
          <CardsGerenciamento
            titulo="Dashboard"
            subtitulo="Visualize seus dados mensais"
            imagem={imagens[0]}
            href="/adm/dashboard"
          />
          <CardsGerenciamento
            titulo="Cardápio"
            subtitulo="Modifique os produtos amostra"
            imagem={imagens[1]}
            href="/adm/listarProdutos"
          />
          <CardsGerenciamento
            titulo="Recomendação"
            subtitulo="Altere a recomendação do dia"
            imagem={imagens[2]}
            href="/adm/recomendacao"
          />
        </div>

        <div className="cards-rumo">
          <CardsGerenciamento
            titulo="Estoque"
            subtitulo="Registre e rastreie seus produtos"
            imagem={imagens[3]}
            href="/adm/estoque"
          />
          <CardsGerenciamento
            titulo="Vendas"
            subtitulo="Registre as saidas de estoque"
            imagem={imagens[4]}
            href="/adm/vendas"
          />
          <CardsGerenciamento
            titulo="Retornar ao Site"
            subtitulo="Voltar para o site principal"
            imagem={imagens[5]}
            href="/"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeGerenciamento;
