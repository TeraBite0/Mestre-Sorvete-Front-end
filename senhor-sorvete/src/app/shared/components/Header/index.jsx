import "./header.css";
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
    const location = useLocation();
    const [menuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        
        <>
        <div className="containerHeader" id="start"></div>
        <div className="containerHeader" style={{position: 'fixed'}} id="start">
            <div className="containerImgLogo">
                <Link to="/"><img src="/Imagens/logo-mestre-sorvete.png" alt="logo sorvete" /></Link>
            </div>
            <div className={`containerListItem ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li className={isActive('/')}><Link to="/">Home</Link></li>
                    <li className={isActive('/cardapio')}><Link to="/cardapio">Cardápio</Link></li>
                    <li className={isActive('/gastronomia')}><Link to="/gastronomia">Gastronomia</Link></li>
                    <li className={isActive('/contato')}><Link to="/contato">Contato</Link></li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default Header;
