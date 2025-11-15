export interface Finish {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  storeLink?: string;
  imageData?: string; // Base64 encoded image data
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFinishInput {
  name: string;
  description: string;
  price: number;
  tags: string[];
  storeLink?: string;
  imageData?: string;
}

export interface UpdateFinishInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  storeLink?: string;
  imageData?: string;
}
