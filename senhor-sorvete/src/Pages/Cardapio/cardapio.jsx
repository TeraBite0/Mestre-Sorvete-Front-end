import React, { useState, useEffect, useRef } from 'react';
import './cardapio.css';
import Filtros from '../../Components/Filtros/Filtro.tsx';
import Header from '../../Components/Header/index.jsx';
import Footer from '../../Components/Footer/index.jsx';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Cardapio = () => {
    const [termo, setTermo] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos

    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    useEffect(() => {
        // Busca os produtos da API ao carregar o componente
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/produtos/isAtivos');
                setProdutos(response.data); // Armazena os produtos no estado
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };
        fetchProdutos();
    }, []);

    const addToCart = (produto) => {
        if (!cartItems.some(item => item.id === produto.id)) {
            setCartItems([...cartItems, { ...produto, price: produto.preco }]);
        }
    };

    const removeFromCart = (produtoId) => {
        setCartItems(cartItems.filter(item => item.id !== produtoId));
    };

    // Filtra os produtos com base no termo de pesquisa e na faixa de preço
    const filteredProdutos = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo.toLowerCase()) &&
        produto.preco <= priceRange
    );

    return (
        <div className="containerCardapio">
            <Header />
            <div className="banner">
                <img src="Imagens/sorvete-baunilha.jpg" alt="" />
                <div className="bannerContent">
                    <h1>Lorem Ipsum Lorem</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed.</p>
                </div>
            </div>

            <nav className="navegacao">
                <ul className="listaNavegacao" style={{
                }}>
                    <li className="itemNavegacao">Popular</li>
                    <li className="itemNavegacao">Sorvetes</li>
                    <li className="itemNavegacao">Picolés</li>
                </ul>
                <div className="barraPesquisa">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={termo}
                        onChange={(e) => setTermo(e.target.value)}
                        className="inputPesquisa"
                    />
                    <button className="botaoPesquisa">
                        <SearchIcon sx={{ fontSize: 16 }} />
                    </button>
                </div>
            </nav>

            <div className="mainContentWrapper" ref={mainContentRef}>
                <div className="mainContent">
                    <div className={`sidebarWrapper`} ref={sidebarRef}>
                        <aside className="sidebar" style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem' }}>
                            <Filtros
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                            />
                        </aside>
                        <aside className="notifications" style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', marginTop: '1rem' }}>
                            <h2>Notificações</h2>
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        <img src="Imagens/sorvete-de-pote-chocolate.png" alt={item.nome} />
                                        <div className="cartItemDetails">
                                            <h4 title={item.nome}>{item.nome}</h4>
                                            <p>R$ {item.price.toFixed(2)}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)}>Remover</button>
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

                    <main className="products grid grid-cols-3 gap-6 justify-center">
                        {filteredProdutos.map((produto, index) => (
                            <div key={index} className="product bg-white rounded-3xl p-6 text-center">
                                <img src="Imagens/casquinhas-de-chocolate.jpeg" alt={`${produto.nome} Ice Cream`} className="w-full h-48 object-cover rounded-2xl mb-4" />
                                <div className="product-name font-bold mb-2" title={produto.nome}>
                                    {produto.nome}
                                </div>
                                <p className="font-semibold mb-2">R$ {produto.preco.toFixed(2)}</p>
                                <button
                                    className="notifyMe w-full py-2 bg-white border border-gray-200 rounded-lg"
                                    onClick={() => addToCart(produto)}
                                    disabled={produto.emEstoque}
                                >
                                    {produto.emEstoque ? "Em Estoque" : "Notifique-me"}
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
