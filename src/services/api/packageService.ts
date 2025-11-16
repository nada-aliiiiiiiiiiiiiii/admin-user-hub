import { apiClient } from './client';
import { Package, UserPackage, CreatePackageRequest, UpdatePackageRequest, PurchasePackageRequest } from '@/models/package';

export const packageService = {
  async getAll(): Promise<Package[]> {
    return apiClient.get<Package[]>('/Package');
  },

  async getById(id: string): Promise<Package> {
    return apiClient.get<Package>(`/Package/${id}`);
  },

  async getUserPackages(userId: string): Promise<UserPackage[]> {
    return apiClient.get<UserPackage[]>(`/Package/user/${userId}`);
  },

  async purchase(data: PurchasePackageRequest): Promise<void> {
    return apiClient.post<void>('/Package/purchase', data);
  },

  async create(data: CreatePackageRequest): Promise<Package> {
    return apiClient.post<Package>('/Package/admin', data);
  },

  async update(id: string, data: UpdatePackageRequest): Promise<Package> {
    return apiClient.put<Package>(`/Package/admin/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/Package/admin/${id}`);
  },
};
