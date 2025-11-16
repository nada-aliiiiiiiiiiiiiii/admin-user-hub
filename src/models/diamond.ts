export interface DiamondPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserDiamond {
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface DiamondTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'add' | 'deduct' | 'purchase';
  description?: string;
  createdAt: string;
}

export interface CreateDiamondPackageRequest {
  name: string;
  amount: number;
  price: number;
  description?: string;
}

export interface UpdateDiamondPackageRequest {
  name?: string;
  amount?: number;
  price?: number;
  description?: string;
  isActive?: boolean;
}

export interface PurchasePackageRequest {
  packageId: string;
}

export interface DiamondOperationRequest {
  userId: string;
  amount: number;
  description?: string;
}
