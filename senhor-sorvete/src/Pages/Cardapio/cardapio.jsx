import React, { useState, useEffect, useRef } from 'react';
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
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Trufado', price: 15.00, quantity: 1 },
        { id: 2, name: 'Lorem', price: 15.00, quantity: 1 },
        { id: 3, name: 'Lorem', price: 15.00, quantity: 1 },
    ]);
    const [isSticky, setIsSticky] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const footerRef = useRef(null);
    const sidebarRef = useRef(null);
    const cartRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 300) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isFooterVisible && sidebarRef.current && cartRef.current) {
            const footerTop = footerRef.current.getBoundingClientRect().top;
            const sidebarBottom = sidebarRef.current.getBoundingClientRect().bottom;
            const cartBottom = cartRef.current.getBoundingClientRect().bottom;

            if (sidebarBottom > footerTop) {
                sidebarRef.current.style.top = `${footerTop - sidebarBottom + window.pageYOffset}px`;
            }

            if (cartBottom > footerTop) {
                cartRef.current.style.top = `${footerTop - cartBottom + window.pageYOffset}px`;
            }
        }
    }, [isFooterVisible]);

    const updateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
        ));
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                    <aside ref={sidebarRef} className={`sidebar ${isSticky ? 'sticky' : ''}`}>
                        <Filtros />
                    </aside>

                    <main className="products">
                        {flavors.map((flavor, index) => (
                            <div key={index} className="product">
                                <img src="Imagens/images (4).jpeg" alt={`${flavor} Ice Cream`} />
                                <h3>{flavor.toUpperCase()}</h3>
                                <p>R$ 15,00</p>
                                <button className="addToCart">Add to cart</button>
                            </div>
                        ))}
                    </main>

                    <aside ref={cartRef} className={`cart ${isSticky ? 'sticky' : ''}`}>
                        <h2>Cart</h2>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id}>
                                    <img src="/placeholder.svg?height=50&width=50" alt={item.name} />
                                    <div className="cartItemDetails">
                                        <h4>{item.name}</h4>
                                        <p>R$ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="quantity">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cartTotal">
                            <p>Sub Total</p>
                            <p>R$ {totalPrice.toFixed(2)}</p>
                        </div>
                        <button className="checkoutButton">TOTAL R$ {totalPrice.toFixed(2)}</button>
                    </aside>
                </div>
            </div>
            <Footer ref={footerRef} />
        </div>
    );
};

export default Cardapio;