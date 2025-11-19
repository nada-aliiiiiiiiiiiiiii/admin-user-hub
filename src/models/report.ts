export interface Report {
  id: string;
  userId: string;
  targetType: 'post' | 'comment' | 'user' | 'project';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  targetType: 'post' | 'comment' | 'user' | 'project';
  targetId: string;
  reason: string;
  description?: string;
}
