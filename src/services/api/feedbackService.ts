import { apiClient } from './client';
import { UserSessionFeedback, CreateFeedbackRequest, UpdateFeedbackRequest, FeedbackStats } from '@/models/feedback';

export const feedbackService = {
  async getAll(): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>('/UserSessionFeedback');
  },

  async getById(id: string): Promise<UserSessionFeedback> {
    return apiClient.get<UserSessionFeedback>(`/UserSessionFeedback/${id}`);
  },

  async getByUserId(userId: string): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>(`/UserSessionFeedback/user/${userId}`);
  },

  async getBySessionId(sessionId: string): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>(`/UserSessionFeedback/session/${sessionId}`);
  },

  async getStats(userId: string): Promise<FeedbackStats> {
    return apiClient.get<FeedbackStats>(`/UserSessionFeedback/stats/${userId}`);
  },

  async getDualFeedback(userId: string): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>(`/UserSessionFeedback/dual/${userId}`);
  },

  async getTeacherFeedback(userId: string): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>(`/UserSessionFeedback/teacher/${userId}`);
  },

  async getStudentFeedback(userId: string): Promise<UserSessionFeedback[]> {
    return apiClient.get<UserSessionFeedback[]>(`/UserSessionFeedback/student/${userId}`);
  },

  async getRoleBreakdown(userId: string, role: 'teacher' | 'student'): Promise<FeedbackStats> {
    return apiClient.get<FeedbackStats>(`/UserSessionFeedback/breakdown/${userId}/${role}`);
  },

  async canGiveFeedback(sessionId: string): Promise<{ canGive: boolean }> {
    return apiClient.get<{ canGive: boolean }>(`/UserSessionFeedback/can-give-feedback/${sessionId}`);
  },

  async hasGivenFeedback(sessionId: string): Promise<{ hasGiven: boolean }> {
    return apiClient.get<{ hasGiven: boolean }>(`/UserSessionFeedback/has-given-feedback/${sessionId}`);
  },

  async create(data: CreateFeedbackRequest): Promise<UserSessionFeedback> {
    return apiClient.post<UserSessionFeedback>('/UserSessionFeedback', data);
  },

  async update(id: string, data: UpdateFeedbackRequest): Promise<UserSessionFeedback> {
    return apiClient.put<UserSessionFeedback>(`/UserSessionFeedback/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/UserSessionFeedback/${id}`);
  },
};
