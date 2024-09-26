import React, { useState, useEffect } from 'react';
import './cardapio.css';
import Filtros from '../../Components/Filtros/Filtro.tsx';
import Header from '../../Components/Header/index.jsx'
import Footer from '../../Components/Footer/index.jsx'

const flavors = [
    "Nescolak",
    "Cookies",
    "Biscoitos",
    "Brigadeirissimo",
    "Maximum: Paçoca Cremosa",
    "Premium: Chocolate Trufado",
    "Mousse de Maracujá",
    "Black Classico",
    "Premium: Frutas Vermelha",
    "Petit Gateau",
    "Gourmet: Cocada Baiana",
    "Trufado Chocolate",
    "Torta de Limão",
    "Trufa",
    "Caramelo",
    "Bolo de Brownie",
    "Bolo de Cenoura",
    "Torta Holandesa",
    "Avelã",
    "Bem Casado",
    "Duo Amore",
    "Brownie com Doce de Leite"
];

const Cardapio = () => {
    const [termo, setTermo] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isSticky, setIsSticky] = useState(false);
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 300) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
                    <li><a href="#flavors">Flavors</a></li>
                    <li><a href="#sundaes">Sundaes</a></li>
                    <li><a href="#recipes">Recipes</a></li>
                </ul>
                <div className="searchBar">
                    <input 
                        type="text" 
                        placeholder="TRUFADO" 
                        value={termo} 
                        onChange={(e) => setTermo(e.target.value)}
                    />
                    <button>🔍</button>
                </div>
            </nav>

            <div className="mainContentWrapper">
                <div className="mainContent">
                    <div className={`sidebarWrapper ${isSticky ? 'sticky' : ''}`}>
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
                                        {/* <img src="Imagens/sorvete-de-pote-chocolate.png?height=50&width=50" alt={item.name} /> */}
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
            <Footer />
        </div>
    );
};

export default Cardapio;