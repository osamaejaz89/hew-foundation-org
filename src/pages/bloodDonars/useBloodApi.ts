import { useApiMutationPatch, useApiQuery } from "../../hooks/useApi";

// src/api/bloodDonors.ts
export const getBloodDonar = (options = {}) => {
  return useApiQuery<any>("blood/donor-request/", {
    refetchOnWindowFocus: true, // Refetch data when the user focuses on the tab
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 1000, // Mark the data as stale after 1 second
    cacheTime: 300000, // Keep cache data for 5 minutes
    ...options, // Override default options
  });
}

// export const getBloodDonar = () => {
//   const { data, isLoading, isError, error } = useApiQuery<any>(
//     "blood/donor-request/"
//   );
//   // useApiQuery<any>("blood/blood-donors");
//   return { data, isLoading, isError, error };
// };

// export const getBloodRequest = () => {
//   const { data, isLoading, isError, error } = useApiQuery<any>(
//     "blood-requests/requests"
//   );
//   return { data, isLoading, isError, error };
// };
export const getBloodRequest = (options = {}) => {
  return useApiQuery<any>("blood-requests/requests", {
    refetchOnWindowFocus: true, // Refetch data when the user focuses on the tab
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 1000, // Mark the data as stale after 1 second
    cacheTime: 300000, // Keep cache data for 5 minutes
    ...options, // Override default options
  });
};

export const getAllBloodUsers = (options = {}) => {
  return useApiQuery<any>("blood/blood-users", {
    refetchOnWindowFocus: true, // Refetch data when the user focuses on the tab
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 1000, // Mark the data as stale after 1 second
    cacheTime: 300000, // Keep cache data for 5 minutes
    ...options, // Override default options
  });
}

// Hook for blood request approval
export const useApproveRejectBloodRequest = (id: string) => {
  return useApiMutationPatch<any>(`blood-requests/${id}/approval`, {
    onSuccess: () => {
      console.log("Request Approved Successfully!");
    },
    onError: () => {
      console.error("Failed to Approve the Request");
    },
  });
};

export const useApprovedRejectBloodDonor = (id: string) => {
  return useApiMutationPatch<any>(`blood/donor-request/${id}/approval`, {
    onSuccess: () => {
      console.log("Request Approved Successfully!");
    },
    onError: () => {
      console.error("Failed to Approve the Request");
    },
  });
};
