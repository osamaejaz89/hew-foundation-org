import apiClient from "./apiClient";
import axios, { AxiosError, AxiosResponse } from "axios";
import { 
  Family, 
  FamilyMember, 
  FamilyStats, 
  FamilyAnalytics,
  FamilyFilters,
  MemberFilters,
  UpdateFamilyPayload,
  UpdateFamilyMemberPayload,
  UpdateMemberStatusPayload,
  BulkUpdatePayload,
  ExportOptions,
  FamiliesApiResponse
} from '../types/family';

// Types
export interface JobFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  type?: string;
  location?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
  _id?: string;
}

export interface JobApplicationFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  jobId?: string;
  applicantId?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
}

export interface ScholarshipApplicationFilters {
  page?: number;
  limit?: number;
  status?: string;
  email?: string;
}

export interface MarriageProfileFilters {
  page?: number;
  limit?: number;
  gender?: string;
  maritalStatus?: string;
  religion?: string;
  city?: string;
  minAge?: number;
  maxAge?: number;
}

// Job Types and Constants
export const JOB_STATUS = {
  ACTIVE: "active",
  CLOSED: "closed",
  DRAFT: "draft",
} as const;

export const JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
} as const;

export const SALARY_PERIODS = {
  YEARLY: "yearly",
  MONTHLY: "monthly",
  HOURLY: "hourly",
} as const;

export const CURRENCIES = {
  USD: "USD",
  PKR: "PKR",
  EUR: "EUR",
} as const;

export const EXPERIENCE_UNITS = {
  YEARS: "years",
  MONTHS: "months",
} as const;

export interface JobCompany {
  name: string;
  logo: string;
  website: string;
  size: string;
  industry: string;
}

export interface JobLocation {
  city: string;
  country: string;
  isRemote: boolean;
  address: string;
}

export interface JobExperience {
  min: number;
  max: number;
  unit: string;
}

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
  period: string;
  isNegotiable: boolean;
}

export interface JobBenefit {
  title: string;
  description: string;
}

export interface JobMetadata {
  isUrgent: boolean;
  isFeatured: boolean;
  tags: string[];
}

export interface JobApplications {
  total: number;
  viewed: number;
  shortlisted: number;
}

export interface Job {
  _id: string;
  title: string;
  company: JobCompany;
  location: JobLocation;
  type: string;
  education: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: JobExperience;
  salary: JobSalary;
  benefits: JobBenefit[];
  postedDate: string;
  deadline: string;
  status: string;
  metadata: JobMetadata;
  rejectionReason?: string;
  applications: JobApplications;
}

// Jobs
export const getJobs = async (filters: JobFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/jobs?${params.toString()}`);
};

export const getJobStatistics = async () => {
  return apiClient.get("/admin/jobs/statistics");
};

export const updateJobStatus = async (
  jobId: string,
  status: string,
  rejectionReason?: string
) => {
  const response = await apiClient.patch(`/admin/jobs/${jobId}/status`, {
    status,
    rejectionReason,
  });
  return response.data;
};

export const toggleJobFeature = async (
  jobId: string,
  data: { isFeatured: boolean }
) => {
  return apiClient.patch(`/jobs/${jobId}/feature`, data);
};

export const createJob = async (jobData: any) => {
  const response = await apiClient.post("/jobs", jobData);
  return response.data;
};

export const updateJob = async (jobId: string, jobData: any) => {
  return apiClient.put(`/jobs/${jobId}`, jobData);
};

export const getJobById = async (jobId: string) => {
  return apiClient.get(`/jobs/${jobId}`);
};

// Job Applications
export interface JobApplication {
  _id: string;
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  resumeUrl?: string;
  coverLetter: string;
  currentCompany: string;
  currentPosition: string;
  skills: string[];
  status: string;
  statusHistory: Array<{
    status: string;
    date: string;
    note: string;
    _id: string;
  }>;
  experience: {
    years: number;
    months: number;
  };
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: number;
  };
  jobId: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo: string;
      website: string;
      size: string;
      industry: string;
    };
    location: {
      city: string;
      country: string;
      isRemote: boolean;
      address: string;
    };
    type: string;
    salary: {
      min: number;
      max: number;
      currency: string;
      period: string;
      isNegotiable: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Base URL = [ip]:[port]/api (same as apiClient)
const raw = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/?$/, "");
const API_BASE_URL = raw.endsWith("/api") ? raw : `${raw}/api`;

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

// Utility functions
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        throw new Error("Unauthorized: Please login again");
      case 403:
        throw new Error(
          "Forbidden: You do not have permission to access this resource"
        );
      case 404:
        throw new Error("Not Found: The requested resource does not exist");
      case 400:
        throw new Error(`Invalid request: ${message}`);
      case 500:
        throw new Error("Server error: Please try again later");
      default:
        throw new Error(`API Error: ${message}`);
    }
  }
  throw new Error("An unexpected error occurred");
};

const buildQueryParams = (filters: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });
  return params;
};

// API functions
export const getJobApplications = async (
  filters: JobApplicationFilters = {}
): Promise<{
  data: JobApplication[];
  pagination: { total: number; page: number; pages: number };
}> => {
  try {
    const queryParams = buildQueryParams({
      page: filters.page || DEFAULT_PAGE,
      limit: filters.limit || DEFAULT_PAGE_SIZE,
      ...filters,
    });

    const response = await axios.get<PaginatedResponse<JobApplication>>(
      `${API_BASE_URL}/admin/job-applications`,
      {
        params: queryParams,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response.data);
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getJobApplicationStatistics = async () => {
  return apiClient.get("/admin/job-applications/statistics");
};

export const getJobApplicationDetails = async (
  id: string
): Promise<JobApplication> => {
  try {
    const response = await axios.get<{ data: JobApplication[] }>(
      `${API_BASE_URL}/admin/job-applications?jobId=${id}`,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response.data);
    return response.data.data[0];
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateJobApplicationStatus = async (
  id: string,
  data: { status: string; feedback: string }
): Promise<JobApplication> => {
  try {
    const response = await axios.patch<{ data: JobApplication }>(
      `${API_BASE_URL}/admin/job-applications/${id}/status`,
      data,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Scholarships
export interface ScholarshipData {
  title: string;
  description: string;
  eligibility: string;
  coverage: string;
  amount: number;
  status: string;
  requirements: string[];
  deadline: string;
  maxApplicants: number;
  isActive: boolean;
  metadata: {
    duration: string;
    renewable: boolean;
    minimumGPA: number;
    programs: string[];
    semesters: string[];
    priorityDeadline: string;
  };
}

export const createScholarship = async (data: ScholarshipData) => {
  return apiClient.post("/admin/scholarships", data);
};

export const updateScholarship = async (
  id: string,
  data: Partial<ScholarshipData>
) => {
  return apiClient.patch(`/admin/scholarships/${id}`, data);
};

export const getScholarshipApplications = async (
  filters: ScholarshipApplicationFilters
) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(
    `/admin/scholarships/applications?${params.toString()}`
  );
};

export const updateScholarshipApplicationStatus = async (
  id: string,
  data: { status: string }
) => {
  return apiClient.patch(
    `/admin/scholarships/applications/${id}/status`,
    data
  );
};

export const getScholarshipStatistics = async () => {
  return apiClient.get("/admin/scholarships/stats/detailed");
};

// Marriage Profiles
export const getMarriageProfiles = async (filters: MarriageProfileFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/admin/marriage/profiles?${params.toString()}`);
};

export const getMarriageProfileById = async (id: string) => {
  return apiClient.get(`/admin/marriage/profiles/${id}`);
};

export const updateMarriageProfileStatus = async (
  id: string,
  data: { status: string }
) => {
  return apiClient.patch(`/admin/marriage/profiles/${id}/status`, data);
};

export const searchMarriageProfiles = async (
  filters: MarriageProfileFilters
) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(
    `/admin/marriage/profiles/search?${params.toString()}`
  );
};

// ===== FAMILY MANAGEMENT APIs =====

// Get all families with pagination and sorting
export const getAllFamilies = async (filters?: FamilyFilters): Promise<{
  data: Family[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const response = await apiClient.get('/admin/families', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all families with statistics included
export const getAllFamiliesWithStats = async (filters?: FamilyFilters): Promise<{
  data: Family[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const response = await apiClient.get('/admin/families/with-stats', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Search families with advanced filters
export const searchFamilies = async (filters: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Family[]; total: number; page: number; limit: number }> => {
  try {
    const response = await apiClient.get('/admin/families/search', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get family details by family code
export const getFamilyByCode = async (familyCode: string): Promise<Family> => {
  try {
    const response = await apiClient.get(`/admin/families/code/${familyCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get family details by user ID
export const getFamilyByUserId = async (userId: string): Promise<Family> => {
  try {
    const response = await apiClient.get(`/admin/families/user/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update family details
export const updateFamily = async (familyCode: string, payload: UpdateFamilyPayload): Promise<Family> => {
  try {
    const response = await apiClient.put(`/admin/families/${familyCode}`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete family and all its members
export const deleteFamily = async (familyCode: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/families/${familyCode}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Bulk update multiple families
export const bulkUpdateFamilies = async (payload: BulkUpdatePayload): Promise<{ updated: number; failed: number }> => {
  try {
    const response = await apiClient.put('/admin/families/bulk/update', payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export family data in JSON or CSV format
export const exportFamilyData = async (options: ExportOptions): Promise<Blob> => {
  try {
    const response = await apiClient.get('/admin/families/export', { 
      params: options,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all family members with filters
export const getAllFamilyMembers = async (filters?: MemberFilters): Promise<{
  data: FamilyMember[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const response = await apiClient.get('/admin/families/members', { params: filters });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all members of a specific family by family code
export const getFamilyMembersByCode = async (familyCode: string): Promise<FamilyMember[]> => {
  try {
    const response = await apiClient.get(`/admin/families/members/family/${familyCode}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get specific family member details by ID (Admin)
export const getFamilyMemberById = async (memberId: string): Promise<FamilyMember> => {
  try {
    const response = await apiClient.get(`/admin/families/members/${memberId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update family member details (Admin)
export const updateFamilyMemberAdmin = async (memberId: string, payload: UpdateFamilyMemberPayload): Promise<FamilyMember> => {
  try {
    const response = await apiClient.put(`/admin/families/members/${memberId}`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a family member (Admin)
export const deleteFamilyMemberAdmin = async (memberId: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/families/members/${memberId}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// Update member status (temporary/permanent)
export const updateMemberStatus = async (memberId: string, payload: UpdateMemberStatusPayload): Promise<FamilyMember> => {
  try {
    const response = await apiClient.patch(`/admin/families/members/${memberId}/status`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get overall family statistics
export const getFamilyStats = async (): Promise<FamilyStats> => {
  try {
    const response = await apiClient.get('/admin/families/stats');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get detailed family analytics and growth data
export const getFamilyAnalytics = async (period?: string): Promise<FamilyAnalytics> => {
  try {
    const params = period ? { period } : {};
    const response = await apiClient.get('/admin/families/analytics', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- Home Updates (App home carousel images) — hidden ---
// export interface HomeUpdateImage {
//   id: string;
//   url: string;
//   filename: string;
//   title: string;
//   description: string;
// }
//
// export const getHomeUpdates = async (): Promise<{ images: HomeUpdateImage[] }> => {
//   const response = await apiClient.get('/home-updates');
//   return response.data;
// };
//
// export const uploadHomeUpdate = async (
//   file: File,
//   title: string = '',
//   description: string = ''
// ): Promise<{ image: HomeUpdateImage }> => {
//   const formData = new FormData();
//   formData.append('image', file);
//   formData.append('title', title);
//   formData.append('description', description);
//   const response = await apiClient.post('/admin/home-updates', formData);
//   return response.data;
// };
//
// export const updateHomeUpdateMeta = async (
//   filename: string,
//   title: string,
//   description: string
// ): Promise<{ image: HomeUpdateImage }> => {
//   const response = await apiClient.patch(`/admin/home-updates/${encodeURIComponent(filename)}`, {
//     title,
//     description,
//   });
//   return response.data;
// };
//
// export const deleteHomeUpdate = async (filename: string): Promise<void> => {
//   await apiClient.delete(`/admin/home-updates/${encodeURIComponent(filename)}`);
// };
