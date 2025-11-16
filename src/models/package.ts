export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CreatePackageRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: string[];
}

export interface UpdatePackageRequest {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isActive?: boolean;
}

export interface PurchasePackageRequest {
  packageId: string;
}
