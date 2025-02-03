export interface Parametros {
  nome: string;
  valor: string;
}

export interface Motores {
  id: number;
  nome: string;
  descricao: string;
  url_endpoint: string;
  parametros: Pick<Parametros, "nome">[];
}

export interface Experimento {
  id?: number;
  id_motor: number;
  versao: number;
  descricao: string;
  dataHora: Date;
  parametros: Parametros[];
}
export interface motorParametros {
  id: number;
  nome: string;
}

export interface MotorComParametros {
  id: number;
  nome: string;
  descricao: string;
  url_endpoint: string;
  parametros: {
    tipo_parametro: string;
    parametros: Parametros[];
  }[];
}
