import PropTypes from 'prop-types';
import "./cardsGerenciamento.css";

const CardsGerenciamento = ({ titulo, subtitulo, imagem, href }) => {
    return (
        <a href={href} className='card'>
                <div className="content">
                    <h1>{titulo}</h1>
                    <h2>{subtitulo}</h2>
                </div>

                <div className="imagem">
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
