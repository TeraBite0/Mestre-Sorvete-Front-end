import React, { useState, useEffect, useRef } from 'react';
import './cardapio.css';
import Filtros from '../../Components/Filtros/Filtro.tsx';
import Header from '../../Components/Header/index.jsx'
import Footer from '../../Components/Footer/index.jsx'
import SearchIcon from '@mui/icons-material/Search';

const flavors = [
    "Nescolak", "Cookies", "Biscoitos", "Brigadeirissimo", "Paçoca",
    "Chocolate", "Mousse", "Black", "Frutas", "Cocada",
    "Trufado", "Limão", "Trufa", "Caramelo", "Brownie",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
    "Cenoura", "Avelã", "Bem Casado", "Duo Amore", "Doce de Leite",
];

const Cardapio = () => {
    const [termo, setTermo] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isSticky, setIsSticky] = useState(false);
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    const addToCart = (flavor) => {
        if (!cartItems.some(item => item.name === flavor)) {
            setCartItems([...cartItems, { name: flavor, price: 15.00 }]);
        }
    };

    const removeFromCart = (flavor) => {
        setCartItems(cartItems.filter(item => item.name !== flavor));
    };

    const filteredFlavors = flavors.filter(flavor => 
        flavor.toLowerCase().includes(termo.toLowerCase()) && 15 <= priceRange
    );

    return (
        <>
        <div className="containerCardapio">
            <Header/>
            <header className="header">
                <div className="headerContent">
                    <h1>Bem Vindo!</h1>
                    <p>Experimente nossos sabores únicos e refrescantes! Feitos com ingredientes frescos e naturais.</p>
                </div>
            </header>

            <nav className="navigation">
                <ul>
                    <li><a href="#recipes">Popular</a></li>
                    <li><a href="#flavors">Sorvetes</a></li>
                    <li><a href="#sundaes">Picolés</a></li>
                </ul>
                <div className="searchBar">
                    <input 
                        type="text" 
                        placeholder="TRUFADO" 
                        value={termo} 
                        onChange={(e) => setTermo(e.target.value)}
                    />
                    <button><SearchIcon sx={{fontSize: 16}}/></button>
                </div>
            </nav>

            <div className="mainContentWrapper" ref={mainContentRef}>
                <div className="mainContent">
                    <div className={`sidebarWrapper ${isSticky ? 'sticky' : ''}`} ref={sidebarRef}>
                        <aside className="sidebar">
                            <Filtros 
                                priceRange={priceRange} 
                                setPriceRange={setPriceRange}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                            />
                        </aside>
                        <aside className="notifications">
                            <h2>Notificações</h2>
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        <img src="Imagens/sorvete-de-pote-chocolate.png" alt={item.name} />
                                        <div className="cartItemDetails">
                                            <h4>{item.name}</h4>
                                            <p>R$ {item.price.toFixed(2)}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.name)}>Remover</button>
                                    </li>
                                ))}
                            </ul>
                            <div className="cartTotal">
                                <p>Total de Notificações</p>
                                <p>{cartItems.length}</p>
                            </div>
                            <button className="checkoutButton">Seja Notificado</button>
                        </aside>
                    </div>

                    <main className="products">
                        {filteredFlavors.map((flavor, index) => (
                            <div key={index} className="product">
                                <img src="Imagens/casquinhas-de-chocolate.jpeg" alt={`${flavor} Ice Cream`} />
                                <h3>{flavor.toUpperCase()}</h3>
                                <p>R$ 15,00</p>
                                <button 
                                    className="notifyMe"
                                    onClick={() => addToCart(flavor)}
                                    disabled={cartItems.some(item => item.name === flavor)}
                                >
                                    {cartItems.some(item => item.name === flavor) ? 'Notificado' : 'Notifique-me'}
                                </button>
                            </div>
                        ))}
                    </main>
                </div>
            </div>
        </div>
        
        <Footer />
        </>
    );
};

export default Cardapio;