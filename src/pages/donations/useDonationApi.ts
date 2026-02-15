import { useApiMutationPatch, useApiQuery } from "../../hooks/useApi";
import { Donation } from "../../types/donation";


// Hit API at most every 15–20 min; cache so no repeated hits in between
const DONATIONS_REFETCH_MS = 15 * 60 * 1000; // 15 minutes
const DONATIONS_STALE_MS = 15 * 60 * 1000;   // 15 min — no refetch until stale
const DONATIONS_CACHE_MS = 20 * 60 * 1000;  // 20 min in cache

export const useDonations = (options = {}) => {
  return useApiQuery<Donation[]>("donations/list", {
    refetchOnWindowFocus: true,
    refetchInterval: DONATIONS_REFETCH_MS,
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