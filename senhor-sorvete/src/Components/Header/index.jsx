import "./header.css";
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="containerHeader" id="start">
            <div className="containerImgLogo">
                <a href="/"><img src="/Imagens/logo-sorvete.png" alt="logo sorvete" /></a>
            </div>
            <div className={`containerListItem ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li className={isActive('/')}><Link to="/">Home</Link></li>
                    <li className={isActive('/cardapio')}><Link to="/cardapio">Cardápio</Link></li>
                    <li className={isActive('/gastronomia')}><Link to="/gastronomia">Gastronomia</Link></li>
                    <li className={isActive('/contato')}><Link to="/contato">Contato</Link></li>
                </ul>
            </div>
            <button className="hamburguer" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
            </button>
        </div>
    )
}

export default Header;
