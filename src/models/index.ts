export interface Prompt {
  id?: number;
  grupo: string;
  descricao: string;
  prompt: string;
  datahora: string;
  ativo: 0 | 1;
}
