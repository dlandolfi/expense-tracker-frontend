import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Expense } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useExpenses(month?: string) {
  return useQuery({
    queryKey: ["expenses", month],
    queryFn: async (): Promise<Expense[]> => {
      const res = await axios.get(`${API_URL}/expenses`, { params: { month } });
      return res.data;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      description: string;
      amount: number;
      paidById: number;
      category: string;
    }) => {
      const res = await axios.post(`${API_URL}/expenses`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`${API_URL}/expenses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}
