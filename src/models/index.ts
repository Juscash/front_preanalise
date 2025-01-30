export interface Parametros {
  id: string;
  nome: string;
  tipo_parametro: string;
  valor: string;
  dataHora: string;
  ativo: 0 | 1;
}

interface TipoParametro {
  tipo_parametro: string;
}
export interface Motores {
  id: string;
  nome: string;
  descricao: string;
  url_endpoint: string;
  parametros: TipoParametro[];
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
