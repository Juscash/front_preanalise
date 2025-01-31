import { useState, useCallback } from "react";
import { getExperimentosMotor } from "../services/api";
import { Experimento } from "../models";

export const useExperimentos = () => {
  const [experimentos, setExperimentos] = useState<Omit<Experimento, "id" | "dataHora">>({
    id_motor: "",
    versao: "",
    descricao: "",
    parametros: [],
  });
  const [experimentosMotor, setExperimentosMotor] = useState<Experimento[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExperimentosMotor = useCallback(async (motorId: string) => {
    setLoading(true);
    try {
      const fetchedExperimentosMotor = await getExperimentosMotor(motorId);
      setExperimentosMotor(fetchedExperimentosMotor);
      const maiorVersao = fetchedExperimentosMotor.reduce((acc, curr) => {
        const versao = parseInt(curr.versao.split(".").join(""), 10);
        return versao > acc ? versao : acc;
      }, 0);
      const novaVersao = maiorVersao + 1;
      setExperimentos((prev) => ({ ...prev, versao: novaVersao.toString() }));
    } catch (error) {
      console.error("Erro ao buscar experimentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { experimentos, setExperimentos, experimentosMotor, fetchExperimentosMotor, loading };
};
