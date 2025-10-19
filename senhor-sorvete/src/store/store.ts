import { configureStore, combineReducers } from "@reduxjs/toolkit";
import filtroCardapioReducer from "./slices/filtroCardapio";
import produtosReducer from "./slices/produtos";

const mestreSorvete = combineReducers({
  filtroCardapio: filtroCardapioReducer,
  produtos: produtosReducer,
});

const store = configureStore({
  reducer: mestreSorvete,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;