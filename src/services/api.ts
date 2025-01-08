import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export interface Prompt {
  id?: number;
  grupo: string;
  descricao: string;
  prompt: string;
  datahora: string;
  ativo: boolean;
}

export interface PromptCreate {
  grupo: string;
  descricao: string;
  prompt: string;
}

export const getPrompts = async (): Promise<Prompt[]> => {
  const response = await api.get<Prompt[]>("/prompts");
  return response.data;
};

export const getSaidasProcessos = async (): Promise<any[]> => {
  const response = await api.get<any[]>("/saidas-processos");
  return response.data;
};

export const getProcessosMotivo = async (motivo: string): Promise<any[]> => {
  const response = await api.get<any[]>(`/processos-por-motivo/${motivo}`);
  return response.data;
};

export const createPrompt = async (promptData: PromptCreate): Promise<void> => {
  try {
    const response = await api.post("/prompts", promptData);
    if (response.status !== 201) {
      throw new Error("Falha ao cadastrar o prompt");
    }
  } catch (error) {
    console.error("Erro ao cadastrar prompt:", error);
    throw error;
  }
};

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const testPrompt = async (
  prompt: string,
  processos: string
): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockResult = {
    acuracia: 50,
    precisao: 50,
    nbe: 50,
    cobertura: 50,
    tableData: [
      {
        processo: "1025828392024810041",
        tribunal: "TJSP",
        analiseHumana: "Aprovado",
        dataAH: "20/03/24",
        justificativaAH: "",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
      {
        processo: "1025828392024810042",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "Sem sentença",
        analiseAutomacao: "Negado",
        justificativaAutomacao: "",
      },
      {
        processo: "1025828392024810043",
        tribunal: "TJSP",
        analiseHumana: "Negado",
        dataAH: "22/03/24",
        justificativaAH: "RPV em iminência de pagamento",
        analiseAutomacao: "Aprovado",
        justificativaAutomacao: "",
      },
    ],
  };

  return mockResult;
};

export default api;
