import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/balance`);
      return res.data;
    },
  });
}
