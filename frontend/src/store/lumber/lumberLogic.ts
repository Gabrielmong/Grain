import type { Lumber, CreateLumberInput, UpdateLumberInput } from '../../types/lumber';

export const createLumber = (input: CreateLumberInput): Lumber => {
  return {
    id: crypto.randomUUID(),
    ...input,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const updateLumberItem = (lumber: Lumber, updates: Omit<UpdateLumberInput, 'id'>): Lumber => {
  return {
    ...lumber,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
};

export const softDeleteLumberItem = (lumber: Lumber): Lumber => {
  return {
    ...lumber,
    isDeleted: true,
    updatedAt: new Date().toISOString(),
  };
};

export const restoreLumberItem = (lumber: Lumber): Lumber => {
  return {
    ...lumber,
    isDeleted: false,
    updatedAt: new Date().toISOString(),
  };
};

export const findLumberById = (items: Lumber[], id: string): Lumber | undefined => {
  return items.find((item) => item.id === id);
};

export const filterActiveLumber = (items: Lumber[]): Lumber[] => {
  return items.filter((item) => !item.isDeleted);
};

export const filterDeletedLumber = (items: Lumber[]): Lumber[] => {
  return items.filter((item) => item.isDeleted);
};
