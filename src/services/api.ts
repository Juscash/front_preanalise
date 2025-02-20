import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Motores, Experimento } from "../models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export interface MotivosProcesso {
  motivo_perda: string;
  id: string;
}

export interface Processo {
  numero_processo: string;
  id_pipefy: string;
}

interface ProcessoFiltro {
  lista_processos: string[];
  motivo?: string;
  data_inicio?: string;
  data_fim?: string;
}

interface TestExperimentoData {
  processos: Processo[];
  id_experimento: number;
  descricao: string;
}

export interface processosAnalisados {
  id_pipefy: string;
  numero_processo: string;
  tribunal: string;
  id_agente_analise: string;
  analise_humana: string;
  justificativa_ah: string | null;
  data_ah: string;
  analise_automatica: string;
  justificativa_aa: string;
  acerto_geral: boolean;
  acerto_bullseye: boolean;
}

interface metricas {
  id_teste: string;
  id_prompt: string;
  id_agente_analise: string;
  nome_prompt: string;
  data_aa: string;
  usuario: string;
  tamanho_amostra: number;
  acuracia: number;
  precisao_negativas: number;
  nbe: number;
  status: string;
  cobertura: number;
}

export interface ExperimentoData {
  outputs: processosAnalisados[];
  metricas: metricas;
}

export interface MessagesChat {
  id: number;
  id_teste: number;
  comentario: string;
  usuario: string;
  dataHora: string;
}
export interface TestesData {
  id_experimento: number;
  id_teste: number;
  id_agente_analise: string;
  nome_prompt: string;
  data_aa: string;
  usuario: string;
  tamanho_amostra: number;
  acuracia: number;
  precisao_negativas: number;
  nbe: number;
  status: string;
  descricao: string;
  versao: string;
  descricao_teste: string;
  cobertura: number;
  historico_observacoes: MessagesChat[];
}

export interface ProcessosFiltroReanalise {
  porcentagem?: number;
  data_inicio: string;
  data_fim: string;
}

const handleApiError = (error: any): never => {
  console.error("API Errorr:", error);
  throw error;
};

export const getIdprocess = async (data: ProcessoFiltro): Promise<Processo[]> => {
  try {
    const response: AxiosResponse<Processo[]> = await api.post(
      "/processos/buscar_id_processos",
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSaidasProcessos = async (): Promise<MotivosProcesso[]> => {
  try {
    const response: AxiosResponse<MotivosProcesso[]> = await api.get("processos/saidas_processos");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProcessosMotivo = async (
  filtro: Omit<ProcessoFiltro, "lista_processos">
): Promise<Processo[]> => {
  try {
    const response: AxiosResponse<Processo[]> = await api.post(
      "processos/processos_por_motivo",
      filtro
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getListarTestes = async (): Promise<TestesData[]> => {
  try {
    const response: AxiosResponse = await api.get("processos/listar_testes");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProcessosTeste = async (id: string | number): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(`processos/listar_resultados_teste/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const testeExperimento = async (data: TestExperimentoData): Promise<ExperimentoData> => {
  try {
    const response: AxiosResponse = await api.post("experimentos/testar", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMotores = async (): Promise<Motores[]> => {
  try {
    const response: AxiosResponse = await api.get("motor/lista");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createExperimento = async (
  experimento: Omit<Experimento, "id" | "dataHora">
): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post("experimentos/gravar", experimento);
    if (response.status !== 201) {
      throw new Error("Falha ao cadastrar o experimento");
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const getExperimentosMotor = async (motor_id: number): Promise<Experimento[]> => {
  try {
    const response: AxiosResponse = await api.get(`experimentos/lista/${motor_id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const processosReanalise = async (data: ProcessosFiltroReanalise): Promise<Processo[]> => {
  try {
    const response: AxiosResponse = await api.post("reanalise/listar_processos", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const reanalise = async (
  data: Omit<TestExperimentoData, "descricao">
): Promise<ExperimentoData> => {
  try {
    console.log(data);
    const response: AxiosResponse = await api.post("reanalise/executar", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const enviarMensagemChat = async (
  message: Pick<MessagesChat, "comentario" | "id_teste">
): Promise<any> => {
  const send = {
    id_teste: message.id_teste,
    comentario: message.comentario,
  };

  try {
    const response: AxiosResponse = await api.post("experimentos/mensagem", send);
    if (response.status !== 201) {
      throw new Error("Falha ao enviar mensagem");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
