import PropTypes from 'prop-types';
import "./cardsGerenciamento.css";

const CardsGerenciamento = ({ titulo, subtitulo, imagem, href }) => {
    return (
        <a href={href} className='card-gerenciamento'>
                <div className="content-gerenciamento">
                    <h1>{titulo}</h1>
                    <h2>{subtitulo}</h2>
                </div>

                <div className="imagem-gerenciamento">
                    {imagem}
                </div>

        </a>
    );
}


CardsGerenciamento.propTypes = {
    titulo: PropTypes.string.isRequired,
    subtitulo: PropTypes.string.isRequired,
    imagem: PropTypes.element.isRequired,
    href: PropTypes.string.isRequired
};

export default CardsGerenciamento;
