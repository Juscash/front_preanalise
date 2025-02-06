import { useState, useCallback } from "react";
import { getMotores } from "../services/api";
import { Motores } from "../models";

export const useMotores = () => {
  const [motores, setMotores] = useState<Motores[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMotores = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedMotores = await getMotores();
      setMotores(fetchedMotores);
    } catch (error) {
      console.error("Erro ao buscar motores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { motores, fetchMotores, loading };
};
