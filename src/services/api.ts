import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Parametros, Motores, motorParametros, MotorComParametros, Experimento } from "../models";

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

export interface ProcessoId {
  numero_processo: string;
  id: string;
}

interface ProcessoFiltro {
  lista_processos: string[];
  motivo?: string;
  data_inicio?: string;
  data_fim?: string;
}

interface TestPromptData {
  lista_processos: Processo[];
  id_prompt: string;
}

const handleApiError = (error: any): never => {
  console.error("API Error:", error);
  throw error;
};

export const getParametros = async (tipo_parametro: string): Promise<Parametros[]> => {
  try {
    const response: AxiosResponse<Parametros[]> = await api.get(
      `parametros/lista/${tipo_parametro}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getIdprocess = async (data: ProcessoFiltro): Promise<Processo[]> => {
  try {
    const response: AxiosResponse<Processo[]> = await api.post(
      "/prompt_tester/buscar_id_processos",
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSaidasProcessos = async (): Promise<MotivosProcesso[]> => {
  try {
    const response: AxiosResponse<MotivosProcesso[]> = await api.get(
      "prompt_tester/saidas_processos"
    );
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
      "prompt_tester/processos_por_motivo",
      filtro
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const setAuthToken = (token: string): void => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getListarTestes = async (): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get("prompt_tester/listar_testes");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProcessosTeste = async (id: string | number): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(`prompt_tester/listar_resultados_teste/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const testPrompt = async (data: TestPromptData): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post("prompt_tester/realizar_teste", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTipoParametros = async (): Promise<{ tipo_parametro: string }[]> => {
  try {
    const response: AxiosResponse = await api.get("parametros/tipos_parametros");
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

export const getMotorParametros = async (tipo_parametro: string): Promise<motorParametros[]> => {
  try {
    const response: AxiosResponse = await api.get(
      `motor/listar_motor_parametros/${tipo_parametro}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMotorParametrosPorMotor = async (id_motor: string): Promise<MotorComParametros> => {
  try {
    const response: AxiosResponse = await api.get(`motor/listar_motor_com_parametros/${id_motor}`);
    return response.data[0];
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

export const getExperimentos = async (): Promise<Experimento[]> => {
  try {
    const response: AxiosResponse = await api.get("experimentos/lista");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getExperimentosMotor = async (motor_id: string): Promise<Experimento[]> => {
  try {
    const response: AxiosResponse = await api.get(`experimentos/lista/${motor_id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
export default api;
