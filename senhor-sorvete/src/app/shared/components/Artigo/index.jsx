import { ButtonNavegation } from "../buttonNavegation/ButtonNavegation";
import "./artigo.css";

const Artigo = (props) => {
  return (
    <div className="artigo">
      <div className="informacoes">
        <img src={props.imagem} alt={props.placeholder} />

        <div className="texto-artigo">
          <h6>{props.titulo}</h6>
          <p>{props.texto}</p>
          {/* <a href={props.link} className="link-saiba-mais" target="_blank" rel="noopener noreferrer">
            Saiba mais
          </a> */}
          <ButtonNavegation
            pagina={props.link}
            texto="Saiba Mais"
            classNameDiv="button"
            classNameButton="btn-primary"
            tipo="button" />
        </div>
      </div>
    </div>
  );
};

export default Artigo;
