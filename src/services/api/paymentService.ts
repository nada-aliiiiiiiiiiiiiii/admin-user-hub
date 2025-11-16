import { apiClient } from './client';
import { Payment, InitiatePaymentRequest, ConfirmPaymentRequest } from '@/models/payment';

export const paymentService = {
  async initiate(data: InitiatePaymentRequest): Promise<Payment> {
    return apiClient.post<Payment>('/Payment/initiate', data);
  },

  async confirm(data: ConfirmPaymentRequest): Promise<Payment> {
    return apiClient.post<Payment>('/Payment/confirm', data);
  },

  async getHistory(userId: string): Promise<Payment[]> {
    return apiClient.get<Payment[]>(`/Payment/history/${userId}`);
  },
};
