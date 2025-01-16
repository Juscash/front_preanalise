import axios from "axios";
import { Prompt } from "../models";

const api = axios.create({
  baseURL: "https://back-preanalise-1083557259488.us-central1.run.app/",
});

export interface PromptCreate {
  grupo: string;
  descricao: string;
  prompt: string;
}

export interface MotivosProcesso {
  motivo_perda: string;
  id: string;
}

export interface processos {
  numero_processo: string;
  id: string;
}

const mockPrompts: Prompt[] = [
  {
    id: 1,
    grupo: "Grupo A",
    descricao: "Descrição do grupo A",
    prompt: "Prompt A",
    datahora: "2023-10-01T12:00:00Z",
    ativo: 1,
  },
  {
    id: 2,
    grupo: "Grupo B",
    descricao: "Descrição do grupo B",
    prompt: "Prompt B",
    datahora: "2023-10-02T12:00:00Z",
    ativo: 0,
  },
];
export interface Processos {
  numero_processo: string;
  id: string;
}
const mockSaidasProcessos: MotivosProcesso[] = [
  { motivo_perda: "Perda por extravio", id: "1" },
  { motivo_perda: "Perda por devolução", id: "2" },
  { motivo_perda: "Perda por queima", id: "3" },
];

const mockProcessos = [
  { numero_processo: "12345", id: "1" },
  { numero_processo: "67890", id: "2" },
  { numero_processo: "54321", id: "3" },
  { numero_processo: "09876", id: "4" },
];

export const getPrompts = async (): Promise<Prompt[]> => {
  // const response = await api.get<Prompt[]>("/prompts");
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrompts);
    }, 1000);
  });
};

export const createPrompt = async (promptData: PromptCreate): Promise<void> => {
  // try {
  //   const response = await api.post("/prompts", promptData);
  //   if (response.status !== 201) {
  //     throw new Error("Falha ao cadastrar o prompt");
  //   }
  // } catch (error) {
  //   console.error("Erro ao cadastrar prompt:", error);
  //   throw error;
  // }

  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulando o cadastro
        const newPrompt: Prompt = {
          id: mockPrompts.length + 1,
          ...promptData,
          datahora: new Date().toISOString(),
          ativo: 0,
        };

        mockPrompts.push(newPrompt);

        resolve();
      }, 1000);
    });
  } catch (error) {
    console.error("Erro ao cadastrar prompt:", error);
    throw error;
  }
};

export const getSaidasProcessos = async (): Promise<MotivosProcesso[]> => {
  // const response = await api.get<MotivosProcesso[]>("/saidas-processos");
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSaidasProcessos);
    }, 1000);
  });
};

export const getProcessosMotivo = async (
  motivo: string
): Promise<processos[]> => {
  // const response = await api.get<processos[]>(`/processos-por-motivo/${motivo}`);
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      // Retorno dos processos com base no motivo fornecido, ou array vazio se não houver
      resolve(mockProcessos || []);
    }, 1000); // delay de 1 segundo
  });
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
