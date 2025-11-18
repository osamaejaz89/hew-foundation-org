import { 
  Family, 
  FamilyMember, 
  FamilyStats, 
  FamilyAnalytics,
  FamilyTree,
  FamilyTimeline,
  FamilyRelationship,
  UpdateFamilyPayload, 
  UpdateMemberStatusPayload,
  CreateFamilyMemberPayload,
  UpdateFamilyMemberPayload,
  FamilyFilters,
  MemberFilters,
  BulkUpdatePayload,
  ExportOptions,
  FamiliesApiResponse
} from '../types/family';
import apiClient from './apiClient';

export const familyService = {
  // ===== APP LEVEL APIs =====
  
  // Create a new family for the authenticated user
  createFamily: async (): Promise<Family> => {
    const response = await apiClient.post('/api/family-heritage/heritage/family');
    return response.data;
  },

  // Get current user's family member details with all relationships
  getFamilyMemberDetails: async (): Promise<FamilyMember[]> => {
    const response = await apiClient.get('/api/family-heritage/heritage/members');
    return response.data;
  },

  // Get specific family member details by ID
  getSpecificFamilyMember: async (memberId: string): Promise<FamilyMember> => {
    const response = await apiClient.get(`/api/family-heritage/heritage/members/${memberId}`);
    return response.data;
  },

  // Add a new family member with relationship to root member
  addFamilyMember: async (rootMemberId: string, payload: CreateFamilyMemberPayload): Promise<FamilyMember> => {
    const response = await apiClient.post(`/api/family-heritage/heritage/members/${rootMemberId}`, payload);
    return response.data;
  },

  // Update family member details
  updateFamilyMember: async (memberId: string, payload: UpdateFamilyMemberPayload): Promise<FamilyMember> => {
    const response = await apiClient.put(`/api/family-heritage/heritage/members/${memberId}`, payload);
    return response.data;
  },

  // Delete a family member
  deleteFamilyMember: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/api/family-heritage/heritage/members/${memberId}`);
  },

  // Add relationship between two family members
  addRelationship: async (payload: { memberId: string; relatedMemberId: string; relationshipType: string }): Promise<FamilyRelationship> => {
    const response = await apiClient.post('/api/family-heritage/heritage/relationships', payload);
    return response.data;
  },

  // Remove relationship between two family members
  removeRelationship: async (payload: { memberId: string; relatedMemberId: string; relationshipType: string }): Promise<void> => {
    await apiClient.delete('/api/family-heritage/heritage/relationships', { data: payload });
  },

  // Get family tree starting from a specific member
  getFamilyTree: async (memberId: string, depth?: number): Promise<FamilyTree> => {
    const params = depth ? `?depth=${depth}` : '';
    const response = await apiClient.get(`/api/family-heritage/heritage/tree/${memberId}${params}`);
    return response.data;
  },

  // Search family members with filters
  searchFamilyMembers: async (filters: {
    search?: string;
    gender?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: FamilyMember[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/family-heritage/heritage/search', { params: filters });
    return response.data;
  },

  // Get family statistics and analytics
  getFamilyStatistics: async (): Promise<FamilyStats> => {
    const response = await apiClient.get('/api/family-heritage/heritage/statistics');
    return response.data;
  },

  // Get chronological timeline of family events
  getFamilyTimeline: async (): Promise<FamilyTimeline[]> => {
    const response = await apiClient.get('/api/family-heritage/heritage/timeline');
    return response.data;
  },

  // ===== ADMIN LEVEL APIs =====

  // Get all families with pagination and sorting
  getAllFamilies: async (filters?: FamilyFilters): Promise<{ data: Family[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/admin/families', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    // Transform the API response to match the expected format
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  },

  // Get all families with statistics included
  getAllFamiliesWithStats: async (filters?: FamilyFilters): Promise<{ data: Family[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/admin/families/with-stats', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  },

  // Search families with advanced filters
  searchFamilies: async (filters: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Family[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/admin/families/search', { params: filters });
    const apiResponse: FamiliesApiResponse = response.data;
    
    return {
      data: apiResponse.families,
      total: apiResponse.pagination.total,
      page: apiResponse.pagination.page,
      limit: apiResponse.pagination.limit
    };
  },

  // Get family details by family code
  getFamilyByCode: async (familyCode: string): Promise<Family> => {
    const response = await apiClient.get(`/api/admin/families/code/${familyCode}`);
    return response.data;
  },

  // Get family details by user ID
  getFamilyByUserId: async (userId: string): Promise<Family> => {
    const response = await apiClient.get(`/api/admin/families/user/${userId}`);
    return response.data;
  },

  // Update family details
  updateFamily: async (familyCode: string, payload: UpdateFamilyPayload): Promise<Family> => {
    const response = await apiClient.put(`/api/admin/families/${familyCode}`, payload);
    return response.data;
  },

  // Delete family and all its members
  deleteFamily: async (familyCode: string): Promise<void> => {
    await apiClient.delete(`/api/admin/families/${familyCode}`);
  },

  // Bulk update multiple families
  bulkUpdateFamilies: async (payload: BulkUpdatePayload): Promise<{ updated: number; failed: number }> => {
    const response = await apiClient.put('/api/admin/families/bulk/update', payload);
    return response.data;
  },

  // Export family data in JSON or CSV format
  exportFamilyData: async (options: ExportOptions): Promise<Blob> => {
    const response = await apiClient.get('/api/admin/families/export', { 
      params: options,
      responseType: 'blob'
    });
    return response.data;
  },

  // Get all family members with filters
  getAllFamilyMembers: async (filters?: MemberFilters): Promise<{ data: FamilyMember[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/admin/families/members', { params: filters });
    return response.data;
  },

  // Get all members of a specific family by family code
  getFamilyMembersByCode: async (familyCode: string): Promise<FamilyMember[]> => {
    const response = await apiClient.get(`/api/admin/families/members/family/${familyCode}`);
    return response.data;
  },

  // Get specific family member details by ID (Admin)
  getFamilyMemberById: async (memberId: string): Promise<FamilyMember> => {
    const response = await apiClient.get(`/api/admin/families/members/${memberId}`);
    return response.data;
  },

  // Update family member details (Admin)
  updateFamilyMemberAdmin: async (memberId: string, payload: UpdateFamilyMemberPayload): Promise<FamilyMember> => {
    const response = await apiClient.put(`/api/admin/families/members/${memberId}`, payload);
    return response.data;
  },

  // Delete a family member (Admin)
  deleteFamilyMemberAdmin: async (memberId: string): Promise<void> => {
    await apiClient.delete(`/api/admin/families/members/${memberId}`);
  },

  // Update member status (temporary/permanent)
  updateMemberStatus: async (memberId: string, payload: UpdateMemberStatusPayload): Promise<FamilyMember> => {
    const response = await apiClient.patch(`/api/admin/families/members/${memberId}/status`, payload);
    return response.data;
  },

  // Get overall family statistics
  getFamilyStats: async (): Promise<FamilyStats> => {
    const response = await apiClient.get('/api/admin/families/stats');
    return response.data;
  },

  // Get detailed family analytics and growth data
  getFamilyAnalytics: async (period?: string): Promise<FamilyAnalytics> => {
    const params = period ? { period } : {};
    const response = await apiClient.get('/api/admin/families/analytics', { params });
    return response.data;
  },
}; 