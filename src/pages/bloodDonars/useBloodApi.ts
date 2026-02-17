import { useApiMutationPatch, useApiQuery } from "../../hooks/useApi";

// Manual refresh only — no auto polling (saves bandwidth)
export const getBloodDonar = (options = {}) => {
  return useApiQuery<any>("blood/donor-request/", {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    ...options,
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
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    ...options,
  });
};

export const getAllBloodUsers = (options = {}) => {
  return useApiQuery<any>("blood/blood-users", {
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    ...options,
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
