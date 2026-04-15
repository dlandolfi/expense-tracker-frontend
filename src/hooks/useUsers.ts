import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const res = await axios.get(`${API_URL}/users`);
      return res.data;
    },
  });
}
