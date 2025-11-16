export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  type: string;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentRequest {
  amount: number;
  type: string;
  referenceId?: string;
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  transactionId?: string;
}
