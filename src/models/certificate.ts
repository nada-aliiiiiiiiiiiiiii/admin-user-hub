export interface Certificate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  credentialId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateRequest {
  title: string;
  description?: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  credentialId?: string;
}

export interface UpdateCertificateRequest {
  title?: string;
  description?: string;
  issuedBy?: string;
  issuedDate?: string;
  expiryDate?: string;
  certificateUrl?: string;
  credentialId?: string;
}
