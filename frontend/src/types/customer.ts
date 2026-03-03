import type { Project } from './project';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  projects?: Pick<Project, 'id' | 'name' | 'status' | 'description' | 'price' | 'createdAt'>[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  projectIds?: string[];
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  projectIds?: string[];
}
