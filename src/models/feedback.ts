export interface UserSessionFeedback {
  id: string;
  userId: string;
  sessionId: string;
  rating: number;
  comment?: string;
  role: 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  sessionId: string;
  rating: number;
  comment?: string;
  role: 'teacher' | 'student';
}

export interface UpdateFeedbackRequest {
  rating?: number;
  comment?: string;
}

export interface FeedbackStats {
  averageRating: number;
  totalFeedbacks: number;
  ratingBreakdown: {
    rating: number;
    count: number;
  }[];
}
