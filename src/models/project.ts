export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending';
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending';
}
