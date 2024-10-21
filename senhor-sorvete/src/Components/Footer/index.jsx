import { Link, useLocation } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const location = useLocation();
  const ano = new Date().getFullYear();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="footer">
      {/* Conteúdo principal do rodapé */}
      <div className="footer-content">
        <div className="logo">
        {/* <a href="/"> */}
          <a href="#start">
          <img
            src="/Imagens/logo-terabite.png"
            alt="Logo da empresa TeraBite"
          />
          </a>
        </div>

        <div className="sobre-projeto">
          <p>
            Este projeto é resultado da dedicação e expertise da equipe
            TeraBite. Cada detalhe foi pensado com cuidado para proporcionar a
            melhor experiência aos nossos clientes.
          </p>
        </div>

        <div className="itens-footer">
          <ul>
            <li className={isActive("/")}>
              <Link to="/">Home</Link>
            </li>
            <li className={isActive("/cardapio")}>
              <Link to="/cardapio">Cardápio</Link>
            </li>
          </ul>
          <ul>
            <li className={isActive("/contato")}>
              <Link to="/contato">Contato</Link>
            </li>
            <li className={isActive("/gastronomia")}>
              <Link to="/gastronomia">Gastronomia</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; {ano} TeraBite. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Footer;
