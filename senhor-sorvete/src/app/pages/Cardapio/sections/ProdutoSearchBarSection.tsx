import SearchIcon from "@mui/icons-material/Search";

type ProdutoSearchBarProps = {
  termo: string;
  setTermo: (value: string) => void;
};

const ProdutoSearchBarSection = ({ termo, setTermo }: ProdutoSearchBarProps) => (
  <div className="barraPesquisaCardapio">
    <input
      type="text"
      placeholder="Pesquisar..."
      value={termo}
      onChange={(e) => setTermo(e.target.value)}
      className="inputPesquisa"
    />
    <button className="botaoPesquisa">
      <SearchIcon sx={{ fontSize: 16 }} />
    </button>
  </div>
);

export default ProdutoSearchBarSection;
