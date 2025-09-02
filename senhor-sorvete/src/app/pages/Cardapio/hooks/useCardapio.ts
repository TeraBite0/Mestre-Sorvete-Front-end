import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useCardapio = () => {
  const [termo, setTermo] = useState("");
  type CartItem = {
    id: any;
    preco: any;
    price?: number;
    quantity?: number;
    nome?: string;
    [key: string]: any;
  };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [priceRange, setPriceRange] = useState(15);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaisModalOpen, setIsMaisModalOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [produtosPopulares] = useState<{ id: any }[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isPopularToggled] = useState(false);

  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://mestre-sorvete-back-end.onrender.com/produtos/ativos"
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

  const [isLoadingPopular] = useState(false);
  const closeMaisModal = () => setIsMaisModalOpen(false);

  const addToCart = (produto: { id: any; preco: any; }) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === produto.id);

      if (itemExists) {
        return prevItems.map((item) =>
          item.id === produto.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...produto, price: produto.preco, quantity: 1 }];
      }
    });
  };


  const removeFromCart = (id: number) => {
    setCartItems((prevItems: any) => {
      return prevItems
        .map((item: any) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) - 1;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item: any) => item !== null); 
    });
  };


  const filteredProdutos = produtos.filter((produto: any) => {
    const matchesTermo = termo
      ? produto.nome.toLowerCase().includes(termo.toLowerCase())
      : true;

    const matchesPrice = produto.preco <= priceRange;

    const matchesCategory =
      selectedCategories.length === 0 ||
      (produto.subtipo && selectedCategories.includes(produto.subtipo.nome)) ||
      (produto.subtipo && produto.subtipo.tipoPai && selectedCategories.includes(produto.subtipo.tipoPai.nome));

    const matchesType =
      selectedTypes.length === 0 ||
      (produto.subtipo && produto.subtipo.tipoPai && selectedTypes.includes(produto.subtipo.tipoPai.nome));

    const matchesPopular =
      !isPopularToggled ||
      produtosPopulares.some(
        (popularProduto) => popularProduto.id === produto.id
      );

    return (
      matchesTermo &&
      matchesPrice &&
      matchesCategory &&
      matchesType &&
      matchesPopular
    );
  });

  const handleConfirm = () => {

    const numeroVendedor = 5511988469500;

    if (cartItems.length === 0) {
      toast.error("Nenhum item no carrinho para enviar.");
      return;
    }

    const produtosReservados = cartItems.map((item) => {
      const price = item.price !== undefined ? item.price : 0;
      return `${item.nome} - ${item.quantity}x - R$ ${price.toFixed(2).replace(".", ",")}`;
    }).join("\n");
    const valorTotal = cartItems
      .reduce((total, item) => total + ((item.price ?? 0) * (item.quantity || 1)), 0)
      .toFixed(2)
      .replace(".", ",");

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

    const mensagem = encodeURIComponent(
      `Olá, Josué! Gostaria de realizar uma reserva.\n\n` +
      `📅 *Data da reserva:* ${dataFormatada}\n\n` +
      `🛍️ *Produtos reservados:*\n${produtosReservados}\n\n` +
      `💰 *Valor total:* R$ ${valorTotal}\n\n` +
      `Aguardo a confirmação. Desde já, obrigado!`
    );

    window.open(
      `https://api.whatsapp.com/send?phone=${numeroVendedor}&text=${mensagem}`,
      "_blank"
    );


  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEmailError("");
    setEmail("");
  };

  return {
    termo,
    setTermo,
    cartItems,
    addToCart,
    removeFromCart,
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    produtos: filteredProdutos,
    isLoading,
    isModalOpen,
    openModal,
    closeModal,
    handleConfirm,
    isMaisModalOpen,
    closeMaisModal,
    sidebarRef,
    mainContentRef,
    isLoadingPopular,
    selectedTypes,
    setSelectedTypes,
    isPopularToggled,
    email,
    setEmail,
    emailError,
    setEmailError
  }
};

export default useCardapio;