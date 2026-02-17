import { useApiMutationPatch, useApiQuery } from "../../hooks/useApi";
import { Donation } from "../../types/donation";


// Manual refresh only — no auto polling (saves bandwidth)
const DONATIONS_STALE_MS = 5 * 60 * 1000;   // 5 min considered fresh
const DONATIONS_CACHE_MS = 15 * 60 * 1000; // 15 min in cache

export const useDonations = (options = {}) => {
  return useApiQuery<Donation[]>("donations/list", {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: DONATIONS_STALE_MS,
    cacheTime: DONATIONS_CACHE_MS,
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