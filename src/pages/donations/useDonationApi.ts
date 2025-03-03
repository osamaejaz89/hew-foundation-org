import { useApiMutationPatch, useApiQuery } from "../../hooks/useApi";
import { Donation } from "../../types/donation";


export const useDonations = (options = {}) => {
  return useApiQuery<Donation[]>("donations/list", {
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    staleTime: 1000,
    cacheTime: 300000,
    ...options,
  });
};

export const useApproveDonation = (id?: string) => {
  return useApiMutationPatch<any>(`donations/update-status/${id}`, {
    onSuccess: () => {
      console.log("Donation status updated successfully!");
    },
    onError: () => {
      console.error("Failed to update donation status");
    },
  });
}; 