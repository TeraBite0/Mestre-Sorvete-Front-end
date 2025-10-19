import Api from './api/ApiConfig';
import { ApiException } from './api/ApiException';

export interface ISubtipo {
    id: number;
    nome: string;
}

export const listarSubtipos = async (): Promise<ISubtipo[] | ApiException> => {
    try {
        const { data } = await Api.get<ISubtipo[]>('/tipos');
        return data;
    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao listar subtipos');
    }
};
