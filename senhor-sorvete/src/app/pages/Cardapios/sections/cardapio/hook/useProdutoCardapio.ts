// import { useEffect } from "react";
// import { listarProdutosAtivos } from "../../../../../../service/ProdutoService";
// import { ApiException } from "../../../../../../service/api/ApiException";
// import { setListaProdutosAtivos } from "../../../../../../store/slices/produtos";
// import { RootState } from "../../../../../../store/store";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";

// const useProdutoCardapio = () => {
//   const dispatch = useDispatch();
//   const produtos = useSelector(
//     (state: RootState) => state.produtos.listaProdutosAtivos
//   );

//   useEffect(() => {
//       if (produtos.length === 0) {
//         const carregarProdutos = async () => {
//           const resposta = await listarProdutosAtivos();
  
//           if (resposta instanceof ApiException) {
//             console.error("Erro ao buscar subtipos:", resposta.message);
//           } else {
//             const produto = resposta.map((produto) => produto);
//             dispatch(setListaProdutosAtivos(produto));
//           }
//         };
  
//         carregarProdutos();
//       }
//     }, [produtos, dispatch]);
// };

export {};