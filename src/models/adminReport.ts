export interface AdminReport {
  id: string;
  userId: string;
  reportType: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  reportedBy?: string;
  reportedByName?: string;
}

export interface UpdateReportStatusRequest {
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
}

export interface AdminReportStats {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  rejected: number;
}
