import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadStateFromLocalStorage } from '../../utils/localStorageUtils';

interface ProdutosState {
  listaProdutosAtivos: any[];
  produtosFiltrados: [],
  carrinho: any[];
  minhaLista: any[];
}

const initialState: ProdutosState = {
  listaProdutosAtivos: loadStateFromLocalStorage("listaProdutosAtivos") || [],
  produtosFiltrados: loadStateFromLocalStorage("produtosFiltrados") || [],
  carrinho: loadStateFromLocalStorage("carrinho") || [],
  minhaLista: loadStateFromLocalStorage("minhaLista") || [],
};

export const produtosSlice = createSlice({
  name: 'produtosAtivos',
  initialState,
  reducers: {
    setListaProdutosAtivos(state, action: PayloadAction<any[]>) {
        state.listaProdutosAtivos = action.payload;
    },
    setProdutosFiltrados: (state, action) => {
        state.produtosFiltrados = action.payload;
    },
    setCarrinho: (state, action) => {
        state.carrinho = action.payload;
    },
    setMinhaLista: (state, action) => {
        state.minhaLista = action.payload;
    },
  },
});

export const { setListaProdutosAtivos, setProdutosFiltrados, setCarrinho, setMinhaLista } = produtosSlice.actions;
export default produtosSlice.reducer;
