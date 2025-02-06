import { useState, useCallback } from "react";
import { getExperimentosMotor } from "../services/api";
import { Experimento } from "../models";

export const useExperimentos = () => {
  const [experimentos, setExperimentos] = useState<Omit<Experimento, "dataHora">>({
    id: 0,
    id_motor: 0,
    versao: 0,
    descricao: "",
    parametros: [],
  });
  const [experimentosMotor, setExperimentosMotor] = useState<Experimento[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExperimentosMotor = useCallback(async (motorId: number) => {
    setLoading(true);
    try {
      const fetchedExperimentosMotor = await getExperimentosMotor(motorId);

      setExperimentosMotor(fetchedExperimentosMotor);
      const maiorVersao = fetchedExperimentosMotor.reduce((acc, curr) => {
        const versao = parseInt(curr.versao.toString().split(".").join(""), 10);
        return versao > acc ? versao : acc;
      }, 0);

      const novaVersao = maiorVersao + 1;
      setExperimentos((prev) => ({ ...prev, versao: novaVersao }));
    } catch (error) {
      console.error("Erro ao buscar experimentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { experimentos, setExperimentos, experimentosMotor, fetchExperimentosMotor, loading };
};
