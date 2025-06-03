export interface Family {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  familyId: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface FamilyStats {
  totalFamilies: number;
  activeFamilies: number;
  totalMembers: number;
  activeMembers: number;
}

export interface UpdateFamilyPayload {
  name: string;
  description: string;
}

export interface UpdateMemberStatusPayload {
  status: 'active' | 'inactive' | 'pending';
} 