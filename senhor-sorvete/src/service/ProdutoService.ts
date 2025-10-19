import Api from './api/ApiConfig';
import { ApiException } from './api/ApiException';

export interface ISubtipo {
    id: number;
    nome: string;
}

export const listarProdutos = async (): Promise<ISubtipo[] | ApiException> => {
    try {
        const { data } = await Api.get<ISubtipo[]>('/produtos');
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao listar subtipos');
    }
};

export const listarProdutosAtivos = async (): Promise<ISubtipo[] | ApiException> => {
    try {
        const { data } = await Api.get<ISubtipo[]>('/produtos/ativos');
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao listar subtipos');
    }
};
