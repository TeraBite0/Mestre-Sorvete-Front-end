import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProdutosState {
  listaProdutosAtivos: any[];
  produtosFiltrados: [],
  carrinho: any[];

}

const initialState: ProdutosState = {
  listaProdutosAtivos: [],
  produtosFiltrados: [],
  carrinho: [],
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
    }
  },
});

export const { setListaProdutosAtivos, setProdutosFiltrados, setCarrinho } = produtosSlice.actions;
export default produtosSlice.reducer;
