import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BalanceResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useBalance(month?: string) {
  const { credentials } = useAuth();
  return useQuery({
    queryKey: ["balance", month],
    queryFn: async (): Promise<BalanceResponse> => {
      const res = await axios.get(`${API_URL}/balance`, {
        params: { month },
        auth: credentials ?? undefined,
      });
      return res.data;
    },
    enabled: !!credentials,
  });
}
