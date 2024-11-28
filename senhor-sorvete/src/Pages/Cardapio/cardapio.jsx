import React, { useState, useEffect, useRef } from "react";
import "./cardapio.css";
import Filtros from "../../Components/Filtros/Filtro.tsx";
import Header from "../../Components/Header/index.jsx";
import Footer from "../../Components/Footer/index.jsx";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { toast } from "react-toastify";

const Cardapio = () => {
    const [termo, setTermo] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMaisModalOpen, setIsMaisModalOpen] = useState(false); 
    const [emailError, setEmailError] = useState("");

    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:8080/produtos/isAtivos"
                );
                setProdutos(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProdutos();
    }, []);

    const openMaisModal = () => setIsMaisModalOpen(true);
    const closeMaisModal = () => setIsMaisModalOpen(false);

    const sendNotification = () => {
        let processedItems = 0;
        cartItems.forEach(async (item, index) => {
            try {
                const response = await axios.post(
                    "http://localhost:8080/notificacoes",
                    {
                        email,
                        idProduto: item.id,
                    }
                );

                if (response.status === 201) {
                    processedItems++;
                    toast.success(
                        "Itens processados: " + processedItems + "/" + cartItems.length
                    );
                }
            } catch (error) {
                console.error("Erro ao mandar notificação ", error);
                toast.error("Tivemos um erro ao registrar a notficação para o produto " + item.nome)
            }
        });
    };

    const addToCart = (produto) => {
        if (!cartItems.some((item) => item.id === produto.id)) {
            setCartItems([...cartItems, { ...produto, price: produto.preco }]);
        }
    };

    const removeFromCart = (produtoId) => {
        setCartItems(cartItems.filter((item) => item.id !== produtoId));
    };

    const filteredProdutos = produtos.filter((produto) => {
        const matchesTermo = produto.nome.toLowerCase().includes(termo.toLowerCase());
        const matchesPrice = produto.preco <= priceRange;
        const matchesCategory =
            selectedCategories.length === 0 || selectedCategories.includes(produto.subtipo.nome);

        return matchesTermo && matchesPrice && matchesCategory;
    });


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleConfirm = () => {
        if (!validateEmail(email)) {
            setEmailError("Por favor, insira um email válido.");
            return;
        }
        setEmailError("");
        closeModal();
        sendNotification();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="containerCardapio">
            <Header />
            <div className="banner">
                <img src="Imagens/sorvete-baunilha.jpg" alt="" />
                <div className="bannerContent">
                    <h1>Bem-vindo!</h1>
                    <p>
                        Experimente nossos sabores únicos e refrescantes! Feitos com
                        ingredientes frescos e naturais.
                    </p>
                </div>
            </div>

            <nav className="navegacao">
                <div>
                    <ul className="listaNavegacao">
                        <li className="itemNavegacao">Popular</li>
                        <li className="itemNavegacao">Picolés</li>
                        <li className="itemNavegacao" onClick={openMaisModal}>Mais...</li>
                        
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
                            {cartItems.length === 0 ? (
                                <p style={{
                                    color: '#888',
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                    padding: '20px'
                                }}>
                                    Nenhum item adicionado ainda
                                </p>
                            ) : (
                                <>
                                    <ul>
                                        {cartItems.map((item, index) => (
                                            <li key={index}>
                                                <img
                                                    src={`https://terabite.blob.core.windows.net/terabite-container/${item.id}`}
                                                    alt={item.nome}
                                                />
                                                <div className="cartItemDetails">
                                                    <h4 title={item.nome}>{item.nome}</h4>
                                                    <p>R$ {item.price.toFixed(2)}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)}>
                                                    Remover
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="checkoutButton" onClick={openModal}>
                                        Seja Notificado
                                    </button>
                                </>
                            )}
                        </aside>
                    </div>

                    <main className="products">
                        {isLoading ? (
                            Array.from(new Array(6)).map((_, index) => (
                                <div key={index} className="product">
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={160}
                                        className="mb-4"
                                    />
                                    <Skeleton width="60%" />
                                    <Skeleton width="40%" />
                                </div>
                            ))
                        ) : produtos.length === 0 ? (
                            <div className="error-message">
                                <p style={{
                                    color: '#8B4513',
                                    textAlign: 'center',
                                    padding: '20px',
                                    backgroundColor: 'rgba(245, 245, 220, 0.6)',
                                    borderRadius: '10px',
                                    width: '50rem'
                                }}>
                                    O conteúdo não pôde ser carregado. Tente novamente mais tarde.
                                </p>
                            </div>
                        ) : (
                            filteredProdutos.map((produto, index) => (
                                <div key={index} className="product">
                                    <img
                                        src={`https://terabite.blob.core.windows.net/terabite-container/${produto.id}`}
                                        alt={`${produto.nome} Ice Cream`}
                                        className="w-full h-48 object-cover rounded-2xl mb-4"
                                    />
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
                            ))
                        )}
                    </main>
                </div>
            </div>
            <Footer />
            <Modal open={isMaisModalOpen} onClose={closeMaisModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        width: 400,
                    }}
                >
                    <h2>Mais Opções</h2>
                    <p>Explore mais categorias e produtos disponíveis em nosso catálogo.</p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={closeMaisModal}
                    >
                        Fechar
                    </Button>
                </Box>
            </Modal>

            <Modal open={isModalOpen} onClose={closeModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        width: 400,
                    }}
                >
                    <h2>Insira seu email</h2>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError} // Mostra a mensagem de erro
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Cardapio;
