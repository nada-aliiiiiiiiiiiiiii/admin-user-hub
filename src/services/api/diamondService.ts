import { apiClient } from './client';
import {
  DiamondPackage,
  UserDiamond,
  DiamondTransaction,
  CreateDiamondPackageRequest,
  UpdateDiamondPackageRequest,
  PurchasePackageRequest,
  DiamondOperationRequest,
} from '@/models/diamond';

export const diamondService = {
  // Package Management
  async getPackages(): Promise<DiamondPackage[]> {
    return apiClient.get<DiamondPackage[]>('/Diamond/packages');
  },

  async createPackage(data: CreateDiamondPackageRequest): Promise<DiamondPackage> {
    return apiClient.post<DiamondPackage>('/Diamond/package/add', data);
  },

  async updatePackage(packageId: string, data: UpdateDiamondPackageRequest): Promise<DiamondPackage> {
    return apiClient.put<DiamondPackage>(`/Diamond/package/update/${packageId}`, data);
  },

  async deletePackage(packageId: string): Promise<void> {
    return apiClient.delete<void>(`/Diamond/package/delete/${packageId}`);
  },

  // User Operations
  async getUserBalance(userId: string): Promise<UserDiamond> {
    return apiClient.get<UserDiamond>(`/Diamond/user/${userId}`);
  },

  async purchasePackage(data: PurchasePackageRequest): Promise<void> {
    return apiClient.post<void>('/Diamond/package/purchase', data);
  },

  async addDiamonds(data: DiamondOperationRequest): Promise<void> {
    return apiClient.post<void>('/Diamond/add', data);
  },

  async deductDiamonds(data: DiamondOperationRequest): Promise<void> {
    return apiClient.post<void>('/Diamond/deduct', data);
  },

  async getTransactions(userId: string): Promise<DiamondTransaction[]> {
    return apiClient.get<DiamondTransaction[]>(`/Diamond/transactions/${userId}`);
  },
};
