import { Family, FamilyMember, FamilyStats, UpdateFamilyPayload, UpdateMemberStatusPayload } from '../types/family';
import apiClient from './apiClient';

export const familyService = {
  // Get all families
  getAllFamilies: async (): Promise<Family[]> => {
    const response = await apiClient.get('/api/admin/families');
    return response.data;
  },

  // Get family stats
  getFamilyStats: async (): Promise<FamilyStats> => {
    const response = await apiClient.get('/api/admin/families/stats');
    return response.data;
  },

  // Get family by code
  getFamilyByCode: async (familyCode: string): Promise<Family> => {
    const response = await apiClient.get(`/api/admin/families/${familyCode}`);
    return response.data;
  },

  // Get family by user ID
  getFamilyByUserId: async (userId: string): Promise<Family> => {
    const response = await apiClient.get(`/api/admin/families/user/${userId}`);
    return response.data;
  },

  // Update family
  updateFamily: async (familyCode: string, payload: UpdateFamilyPayload): Promise<Family> => {
    const response = await apiClient.put(`/api/admin/families/${familyCode}`, payload);
    return response.data;
  },

  // Delete family
  deleteFamily: async (familyCode: string): Promise<void> => {
    await apiClient.delete(`/api/admin/families/${familyCode}`);
  },

  // Get all family members
  getAllFamilyMembers: async (): Promise<FamilyMember[]> => {
    const response = await apiClient.get('/api/admin/families/members');
    return response.data;
  },

  // Update member status
  updateMemberStatus: async (memberId: string, payload: UpdateMemberStatusPayload): Promise<FamilyMember> => {
    const response = await apiClient.put(`/api/admin/families/members/${memberId}/status`, payload);
    return response.data;
  },
}; 