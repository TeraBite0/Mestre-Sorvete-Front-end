import PropTypes from "prop-types";
import "./cardsGerenciamento.css";

const CardsGerenciamento = ({ titulo, subtitulo, imagem, href, onClick }) => {
  const handleClick = (e) => {
    if (!href) e.preventDefault();
    if (onClick) onClick(e);
  };

  return (
    <a
      href={href || "#"}
      onClick={handleClick}
      className="card-gerenciamento"
      style={{ cursor: "pointer" }}
    >
      <div className="content-gerenciamento">
        <h1>{titulo}</h1>
        <h2>{subtitulo}</h2>
      </div>

      <div className="imagem-gerenciamento">{imagem}</div>
    </a>
  );
};

CardsGerenciamento.propTypes = {
  titulo: PropTypes.string.isRequired,
  subtitulo: PropTypes.string.isRequired,
  imagem: PropTypes.element.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export default CardsGerenciamento;
