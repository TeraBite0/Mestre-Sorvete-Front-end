import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProdutosState {
  listaProdutosAtivos: any[];
  produtosFiltrados: [],

}

const initialState: ProdutosState = {
  listaProdutosAtivos: [],
  produtosFiltrados: [],

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
  },
});

export const { setListaProdutosAtivos, setProdutosFiltrados } = produtosSlice.actions;
export default produtosSlice.reducer;
