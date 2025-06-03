import apiClient from './apiClient';

// Types
export interface JobFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  type?: string;
  location?: string;
  isRemote?: boolean;
  isUrgent?: boolean;
  isFeatured?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
}

export interface JobApplicationFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Jobs
export const getJobs = async (filters: JobFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/api/admin/jobs?${params.toString()}`);
};

export const getJobStatistics = async () => {
  return apiClient.get('/api/admin/jobs/statistics');
};

export const updateJobStatus = async (jobId: string, data: { status: string; rejectionReason?: string }) => {
  return apiClient.patch(`/api/admin/jobs/${jobId}/status`, data);
};

export const toggleJobFeature = async (jobId: string, data: { isFeatured: boolean }) => {
  return apiClient.patch(`/api/admin/jobs/${jobId}/feature`, data);
};

// Job Applications
export const getJobApplications = async (filters: JobApplicationFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/api/admin/job-applications?${params.toString()}`);
};

export const getJobApplicationStatistics = async () => {
  return apiClient.get('/api/admin/job-applications/statistics');
};

export const getJobApplicationDetails = async (id: string) => {
  return apiClient.get(`/api/admin/job-applications/${id}`);
};

export const updateJobApplicationStatus = async (id: string, data: { status: string; feedback?: string }) => {
  return apiClient.patch(`/api/admin/job-applications/${id}/status`, data);
};

// Scholarships
export const createScholarship = async (data: {
  title: string;
  description: string;
  amount: number;
  category: string;
  requirements: {
    gpa: number;
    documents: string[];
  };
  deadline: string;
  isActive: boolean;
}) => {
  return apiClient.post('/api/admin/scholarships', data);
};

export const updateScholarship = async (id: string, data: {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  requirements?: {
    gpa?: number;
    documents?: string[];
  };
  deadline?: string;
  isActive?: boolean;
}) => {
  return apiClient.patch(`/api/admin/scholarships/${id}`, data);
};

export const getScholarshipApplications = async (filters: ScholarshipApplicationFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/api/admin/scholarships/applications?${params.toString()}`);
};

export const updateScholarshipApplicationStatus = async (id: string, data: { status: string }) => {
  return apiClient.patch(`/api/admin/scholarships/applications/${id}/status`, data);
};

export const getScholarshipStatistics = async () => {
  return apiClient.get('/api/admin/scholarships/stats/detailed');
};

// Marriage Profiles
export const getMarriageProfiles = async (filters: MarriageProfileFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/api/admin/marriage/profiles?${params.toString()}`);
};

export const getMarriageProfileById = async (id: string) => {
  return apiClient.get(`/api/admin/marriage/profiles/${id}`);
};

export const updateMarriageProfileStatus = async (id: string, data: { status: string }) => {
  return apiClient.patch(`/api/admin/marriage/profiles/${id}/status`, data);
};

export const searchMarriageProfiles = async (filters: MarriageProfileFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  });
  return apiClient.get(`/api/admin/marriage/profiles/search?${params.toString()}`);
}; 