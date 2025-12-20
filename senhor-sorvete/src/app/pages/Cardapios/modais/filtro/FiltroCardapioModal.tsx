import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListaCategoria } from "../../../../../store/slices/filtroCardapio";
import { RootState } from "../../../../../store/store";
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox, Button } from "@mui/material";
import { listarSubtipos } from "../../../../../service/SubtipoService";
import { ApiException } from "../../../../../service/api/ApiException";
import { setProdutosFiltrados } from "../../../../../store/slices/produtos";
import "./FiltroCardapioModal.css";

interface FiltroCategoriaModalProps {
  isMaisModalOpen: boolean;
  isMaisModalClose: () => void;
}

const FiltroCategoriaModal = ({ isMaisModalOpen, isMaisModalClose }: FiltroCategoriaModalProps) => {
  const dispatch = useDispatch();
  const listaCategoria = useSelector((state: RootState) => state.filtroCardapio.listaCategoria);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const listaProdutosAtivos = useSelector((state: RootState) => state.produtos.listaProdutosAtivos);

  useEffect(() => {
    if (listaCategoria.length === 0) {
      const carregarSubtipos = async () => {
        const resposta = await listarSubtipos();

        if (resposta instanceof ApiException) {
          console.error("Erro ao buscar subtipos:", resposta.message);
        } else {
          const nomes = resposta.map((subtipo) => subtipo.nome);
          dispatch(setListaCategoria(nomes));
        }
      };

      carregarSubtipos();
    }
  }, [listaCategoria, dispatch]);

  const handleToggleCategoria = (nome: string) => {
    const prevSelected = categoriasSelecionadas;
    let novasSelecionadas: string[];
    
    if (prevSelected && prevSelected.includes(nome)) {
      novasSelecionadas = prevSelected.filter((cat) => cat !== nome);
    } else {
      novasSelecionadas = prevSelected ? [...prevSelected, nome] : [nome];
    }
    console.log("lista de categoria " + novasSelecionadas);
    setCategoriasSelecionadas(novasSelecionadas);
  };

  const aplicarFiltro = () => {
    const filtrados = listaProdutosAtivos.filter(produto =>
      (categoriasSelecionadas.includes(produto.tipo) ?? false)
    );

    dispatch(setProdutosFiltrados(filtrados));
    isMaisModalClose();
  };

  const limparFiltro = () => {
    setCategoriasSelecionadas([]);
    dispatch(setProdutosFiltrados([])); 
  }

  return (
    <Dialog
      open={isMaisModalOpen}
      onClose={isMaisModalClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Filtro do Cardápio</DialogTitle>
      <DialogContent>
        {listaCategoria.length === 0 ? (
          <p>Carregando categorias...</p>
        ) : (
          listaCategoria.map((nome, index) => (
            <div key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={categoriasSelecionadas.includes(nome)}
                    onChange={() => handleToggleCategoria(nome)}
                    color="primary"
                  />
                }
                label={nome}
              />
            </div>
          ))
        )}
        <div className="btn-filtro-container">
          <Button onClick={limparFiltro}>Limpar filtro</Button>
          <Button onClick={aplicarFiltro} variant="contained" color="primary">Aplicar Filtros</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltroCategoriaModal;
