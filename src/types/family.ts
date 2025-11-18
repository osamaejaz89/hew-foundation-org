export interface Family {
  _id: string;
  familyCode: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  members?: FamilyMember[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Legacy fields for backward compatibility
  id?: string;
  name?: string;
  description?: string;
  memberCount?: number;
  isActive?: boolean;
}

// API Response interfaces
export interface FamiliesApiResponse {
  families: Family[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FamilyMember {
  _id: string;
  userId?: string;
  familyId: string;
  familyCode?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  birthPlace?: string;
  currentLocation?: string;
  occupation?: string;
  education?: string;
  biography?: string;
  profilePicture?: string;
  relationshipType?: string;
  role?: 'admin' | 'member';
  status?: 'active' | 'inactive' | 'pending';
  isTemporaryMember?: boolean;
  parents?: FamilyMember[];
  children?: FamilyMember[];
  siblings?: FamilyMember[];
  spouse?: FamilyMember;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Legacy fields for backward compatibility
  id?: string;
}

export interface FamilyStats {
  totalFamilies: number;
  activeFamilies: number;
  totalMembers: number;
  activeMembers: number;
  pendingMembers?: number;
  temporaryMembers?: number;
  averageMembersPerFamily?: number;
  recentGrowth?: {
    families: number;
    members: number;
    period: string;
  };
}

export interface FamilyAnalytics {
  period: string;
  newFamilies: number;
  newMembers: number;
  activeUsers: number;
  growthRate: number;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
  ageDistribution: Array<{
    range: string;
    count: number;
  }>;
  genderDistribution: Array<{
    gender: string;
    count: number;
  }>;
}

export interface FamilyRelationship {
  id: string;
  memberId: string;
  relatedMemberId: string;
  relationshipType: string;
  createdAt: string;
}

export interface FamilyTree {
  member: FamilyMember;
  relationships: FamilyRelationship[];
  children?: FamilyTree[];
  parents?: FamilyTree[];
  siblings?: FamilyTree[];
  spouse?: FamilyTree;
}

export interface FamilyTimeline {
  id: string;
  familyId: string;
  eventType: string;
  title: string;
  description: string;
  date: string;
  memberId?: string;
  createdAt: string;
}

export interface UpdateFamilyPayload {
  familyCode?: string;
  name?: string;
  description?: string;
}

export interface UpdateMemberStatusPayload {
  status: 'active' | 'inactive' | 'pending';
  isTemporaryMember?: boolean;
  userId?: string;
}

export interface CreateFamilyMemberPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  birthPlace?: string;
  currentLocation?: string;
  occupation?: string;
  education?: string;
  biography?: string;
  profilePicture?: string;
  relationshipType: string;
}

export interface UpdateFamilyMemberPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  birthPlace?: string;
  currentLocation?: string;
  occupation?: string;
  education?: string;
  biography?: string;
  profilePicture?: string;
  relationshipType?: string;
  isTemporaryMember?: boolean;
}

export interface FamilyFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

export interface MemberFilters {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  relationshipType?: string;
  status?: string;
}

export interface BulkUpdatePayload {
  familyCodes: string[];
  updates: Partial<UpdateFamilyPayload>;
}

export interface ExportOptions {
  format: 'json' | 'csv';
  filters?: FamilyFilters;
} 