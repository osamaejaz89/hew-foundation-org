import { useState, useEffect } from 'react';
import { Family, FamilyMember, FamilyStats, FamilyAnalytics, FamilyFilters, MemberFilters } from '../types/family';
import { familyService } from '../services/familyService';
import { toast } from 'react-toastify';

export const useFamilyAdmin = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [analytics, setAnalytics] = useState<FamilyAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalFamilies, setTotalFamilies] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  const loadFamilies = async (filters?: FamilyFilters) => {
    setLoading(true);
    try {
      const response = await familyService.getAllFamilies(filters);
      setFamilies(response.data);
      setTotalFamilies(response.total);
    } catch (error) {
      console.error('Error loading families:', error);
      toast.error('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (filters?: MemberFilters) => {
    setLoading(true);
    try {
      const response = await familyService.getAllFamilyMembers(filters);
      setMembers(response.data);
      setTotalMembers(response.total);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await familyService.getFamilyStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load family statistics');
    }
  };

  const loadAnalytics = async (period?: string) => {
    try {
      const analyticsData = await familyService.getFamilyAnalytics(period);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load family analytics');
    }
  };

  const searchFamilies = async (filters: { search: string; page?: number; limit?: number }) => {
    setLoading(true);
    try {
      const response = await familyService.searchFamilies(filters);
      setFamilies(response.data);
      setTotalFamilies(response.total);
    } catch (error) {
      console.error('Error searching families:', error);
      toast.error('Failed to search families');
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = async (filters: { search: string; gender?: string; page?: number; limit?: number }) => {
    setLoading(true);
    try {
      const response = await familyService.searchFamilyMembers(filters);
      setMembers(response.data);
      setTotalMembers(response.total);
    } catch (error) {
      console.error('Error searching members:', error);
      toast.error('Failed to search members');
    } finally {
      setLoading(false);
    }
  };

  const updateFamily = async (familyCode: string, payload: any) => {
    try {
      await familyService.updateFamily(familyCode, payload);
      toast.success('Family updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating family:', error);
      toast.error('Failed to update family');
      return false;
    }
  };

  const deleteFamily = async (familyCode: string) => {
    try {
      await familyService.deleteFamily(familyCode);
      toast.success('Family deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting family:', error);
      toast.error('Failed to delete family');
      return false;
    }
  };

  const updateMember = async (memberId: string, payload: any) => {
    try {
      await familyService.updateFamilyMemberAdmin(memberId, payload);
      toast.success('Member updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
      return false;
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      await familyService.deleteFamilyMemberAdmin(memberId);
      toast.success('Member deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
      return false;
    }
  };

  const updateMemberStatus = async (memberId: string, payload: any) => {
    try {
      await familyService.updateMemberStatus(memberId, payload);
      toast.success('Member status updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
      return false;
    }
  };

  const exportData = async (format: 'json' | 'csv', filters?: any) => {
    try {
      const blob = await familyService.exportFamilyData({ format, filters });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `families-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Export completed: families-export.${format}`);
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
      return false;
    }
  };

  return {
    // State
    families,
    members,
    stats,
    analytics,
    loading,
    totalFamilies,
    totalMembers,

    // Actions
    loadFamilies,
    loadMembers,
    loadStats,
    loadAnalytics,
    searchFamilies,
    searchMembers,
    updateFamily,
    deleteFamily,
    updateMember,
    deleteMember,
    updateMemberStatus,
    exportData,
  };
}; 