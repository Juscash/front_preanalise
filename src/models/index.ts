export interface Parametros {
  nome: string;
  valor: string;
}

export interface Motores {
  id: string;
  nome: string;
  descricao: string;
  url_endpoint: string;
  parametros: Pick<Parametros, "nome">[];
}

export interface Experimento {
  id?: string;
  id_motor: string;
  versao: string;
  descricao: string;
  dataHora: string;
  parametros: Parametros[];
}
export interface motorParametros {
  id: string;
  nome: string;
}

export interface MotorComParametros {
  id: string;
  nome: string;
  descricao: string;
  url_endpoint: string;
  parametros: {
    tipo_parametro: string;
    parametros: Parametros[];
  }[];
}
