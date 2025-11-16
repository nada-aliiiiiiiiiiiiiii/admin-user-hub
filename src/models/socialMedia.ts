export interface SocialMedia {
  id: string;
  userId: string;
  platform: string;
  url: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialMediaRequest {
  platform: string;
  url: string;
  username?: string;
}

export interface UpdateSocialMediaRequest {
  platform?: string;
  url?: string;
  username?: string;
}
