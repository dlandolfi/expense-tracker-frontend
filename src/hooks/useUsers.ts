import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useUsers() {
  const { credentials } = useAuth();
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await axios.get(`${API_URL}/users`, {
        auth: credentials ?? undefined,
      });
      return res.data;
    },
    enabled: !!credentials,
  });
}
