import { Link, useLocation } from 'react-router-dom';
import './footer.css';

const Footer = () => {

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className='footer' aria-label='Rodapé do site Senhor Sorvete que contém a logo da empresa que criou o site, um texto descrevendo como foi feito o site e um menu de opções.'>
            <div className='logo'>
                <img src='/Imagens/logo-terabite.png' alt='Logo da empresa TeraBite, responsável pela criação e desencolvimento do site.' />
            </div>

            <div className='sobre-projeto'>
                <p>Este projeto é resultado da dedicação e expertise da equipe TeraBite. Cada detalhe foi pensado com cuidado
                    para proporcionar a melhor experiência aos nossos clientes.</p>
            </div>

            <div className="itens">

                <div className='itens-coluna1'>
                    <ul>
                        <li className={isActive('/')}><Link to="/">Home</Link></li>
                        <li className={isActive('/cardapio')}><Link to="/cardapio">Cardápio</Link></li>
                    </ul>
                </div>

                <div className='itens-coluna2'>
                    <ul>
                        <li className={isActive('/contato')}><Link to="/contato">Contato</Link></li>
                        <li className={isActive('/gastronomia')}><Link to="/gastronomia">Gastronomia</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );

}
export default Footer;