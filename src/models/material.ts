export interface Material {
  id: string;
  name: string;
  description?: string;
  type: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  name: string;
  description?: string;
  type: string;
  url?: string;
}

export interface UpdateMaterialRequest {
  name?: string;
  description?: string;
  type?: string;
  url?: string;
}
