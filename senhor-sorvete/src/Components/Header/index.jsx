import "./header.css";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="containerHeader" id="start">
            <div className="containerImgLogo">
                <img src="/Imagens/logo-sorvete.png" alt="logo sorvete" />
            </div>
            <div className="containerListItem">
                <ul>
                    <li className={isActive('/')}><Link to="/">Home</Link></li>
                    <li className={isActive('/cardapio')}><Link to="/cardapio">Cardápio</Link></li>
                    <li className={isActive('/gastronomia')}><Link to="/gastronomia">Gastronomia</Link></li>
                    <li className={isActive('/contato')}><Link to="/contato">Contato</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;