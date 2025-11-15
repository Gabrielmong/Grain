export interface Tool {
  id: string;
  name: string;
  description: string;
  function: string;
  price: number;
  serialNumber?: string;
  imageData?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateToolInput {
  name: string;
  description: string;
  function: string;
  price: number;
  serialNumber?: string;
  imageData?: string;
}

export interface UpdateToolInput {
  name?: string;
  description?: string;
  function?: string;
  price?: number;
  serialNumber?: string;
  imageData?: string;
}
