export interface UserNationalId {
  id: string;
  userId: string;
  nationalIdNumber: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserNationalIdRequest {
  nationalIdNumber: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export interface UpdateUserNationalIdRequest {
  nationalIdNumber?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export interface VerifyNationalIdRequest {
  approved: boolean;
  rejectionReason?: string;
}
