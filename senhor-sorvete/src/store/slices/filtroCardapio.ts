import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltroCardapioState {
  listaCategoria: string[];
}

const initialState: FiltroCardapioState = {
  listaCategoria: [],
};

export const filtroCardapioSlice = createSlice({
  name: 'filtroCardapio',
  initialState,
  reducers: {
    setListaCategoria(state, action: PayloadAction<string[]>) {
      state.listaCategoria = action.payload;
    }
  },
});

export const { setListaCategoria } = filtroCardapioSlice.actions;
export default filtroCardapioSlice.reducer;
