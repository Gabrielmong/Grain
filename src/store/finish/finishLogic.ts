import type { Finish, CreateFinishInput, UpdateFinishInput } from '../../types/finish';

export function createFinish(input: CreateFinishInput): Finish {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    price: input.price,
    tags: input.tags,
    storeLink: input.storeLink,
    imageData: input.imageData,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateFinishItem(finish: Finish, updates: Omit<UpdateFinishInput, 'id'>): Finish {
  return {
    ...finish,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

export function softDeleteFinishItem(finish: Finish): Finish {
  return {
    ...finish,
    isDeleted: true,
    updatedAt: new Date().toISOString(),
  };
}

export function restoreFinishItem(finish: Finish): Finish {
  return {
    ...finish,
    isDeleted: false,
    updatedAt: new Date().toISOString(),
  };
}

export function findFinishById(finishes: Finish[], id: string): Finish | undefined {
  return finishes.find((finish) => finish.id === id);
}

export function filterActiveFinishes(finishes: Finish[]): Finish[] {
  return finishes.filter((finish) => !finish.isDeleted);
}
