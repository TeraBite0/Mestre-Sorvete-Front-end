import React, { useState } from 'react';
import './cardapio.css';
import Filtros from '../../Components/Filtros/Filtro.tsx';

const Cardapio = () => {
    const [termo, setTermo] = useState('');
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Trufado', price: 15.00, quantity: 1 },
        { id: 2, name: 'Lorem', price: 15.00, quantity: 1 },
        { id: 3, name: 'Lorem', price: 15.00, quantity: 1 },
    ]);

    const updateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
        ));
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="containerCardapio">
            <header className="header">
                <div className="headerContent">
                    <h1>Lorem Ipsum Lorem</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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

            <div className="mainContent">
                <aside className="sidebar">
                    <Filtros />
                </aside>

                <main className="products">
                    <div className="product">
                        <img src="/placeholder.svg?height=150&width=150" alt="Trufado Ice Cream" />
                        <h3>TRUFADO</h3>
                        <p>R$ 15,00</p>
                        <button className="addToCart">Add to cart</button>
                    </div>
                    {/* Add more product items here */}
                </main>

                <aside className="cart">
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
    );
};

export default Cardapio;