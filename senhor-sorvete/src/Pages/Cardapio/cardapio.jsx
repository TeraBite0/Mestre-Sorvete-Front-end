import React, { useState, useEffect, useRef } from 'react';
import './cardapio.css';
import Filtros from '../../Components/Filtros/Filtro.tsx';
import Header from '../../Components/Header/index.jsx';
import Footer from '../../Components/Footer/index.jsx';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cardapio = () => {
    const [termo, setTermo] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/produtos/isAtivos');
                setProdutos(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };
        fetchProdutos();
    }, []);

    const sendNotification = () => {
        let processedItems = 0;
        cartItems.forEach(async (item, index) => {
            try {
                const response = await axios.post('http://localhost:8080/notificacoes', {
                    email,
                    idProduto: item.id
                });

                if (response.status === 201) {
                    processedItems++;
                    toast.success("Itens processados: " + processedItems + "/" + cartItems.length);
                }
            } catch (error) {
                console.error('Erro ao mandar notificação ', error);
            }
        });
    };

    const addToCart = (produto) => {
        if (!cartItems.some(item => item.id === produto.id)) {
            setCartItems([...cartItems, { ...produto, price: produto.preco }]);
        }
    };

    const removeFromCart = (produtoId) => {
        setCartItems(cartItems.filter(item => item.id !== produtoId));
    };

    const filteredProdutos = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo.toLowerCase()) &&
        produto.preco <= priceRange
    );

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="containerCardapio">
            <Header />
            <div className="banner">
                <img src="Imagens/sorvete-baunilha.jpg" alt="" />
                <div className="bannerContent">
                    <h1>Bem-vindo!</h1>
                    <p>Experimente nossos sabores únicos e refrescantes! Feitos com ingredientes frescos e naturais.</p>
                </div>
            </div>

            <nav className="navegacao">
                <div>
                    <ul className="listaNavegacao">
                        <li className="itemNavegacao">Popular</li>
                        <li className="itemNavegacao">Sorvetes</li>
                        <li className="itemNavegacao">Picolés</li>
                    </ul>
                </div>
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
                    <div className="sidebarWrapper" ref={sidebarRef}>
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
                            <button className="checkoutButton" onClick={openModal}>Seja Notificado</button>
                        </aside>
                    </div>

                    <main className="products">
                        {filteredProdutos.map((produto, index) => (
                            <div key={index} className="product">
                                <img src="Imagens/casquinhas-de-chocolate.jpeg" alt={`${produto.nome} Ice Cream`} className="w-full h-48 object-cover rounded-2xl mb-4" />
                                <div className="product-name" title={produto.nome}>
                                    {produto.nome}
                                </div>
                                <p>R$ {produto.preco.toFixed(2)}</p>
                                <button
                                    className="notifyMe"
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
            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400 }}>
                    <h2>Insira seu email</h2>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={() => { closeModal(); sendNotification(); }}>
                        Confirmar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Cardapio;
