import type { Project, CreateProjectInput, UpdateProjectInput, Board, CreateBoardInput } from '../../types/project';
import { VARA_TO_INCHES } from '../../types/project';

export function createBoard(input: CreateBoardInput): Board {
  const lengthInInches = input.length * VARA_TO_INCHES;
  const boardFeet = (input.width * input.thickness * lengthInInches) / 144;

  return {
    id: crypto.randomUUID(),
    ...input,
    boardFeet: boardFeet * input.quantity,
  };
}

export function createProject(input: CreateProjectInput): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    boards: input.boards.map(createBoard),
    finishIds: input.finishIds,
    laborCost: input.laborCost,
    miscCost: input.miscCost,
    additionalNotes: input.additionalNotes,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateProjectItem(project: Project, updates: Omit<UpdateProjectInput, 'id'>): Project {
  return {
    ...project,
    name: updates.name ?? project.name,
    description: updates.description ?? project.description,
    boards: updates.boards ? updates.boards.map(createBoard) : project.boards,
    finishIds: updates.finishIds ?? project.finishIds,
    laborCost: updates.laborCost ?? project.laborCost,
    miscCost: updates.miscCost ?? project.miscCost,
    additionalNotes: updates.additionalNotes ?? project.additionalNotes,
    updatedAt: new Date().toISOString(),
  };
}

export function softDeleteProjectItem(project: Project): Project {
  return {
    ...project,
    isDeleted: true,
    updatedAt: new Date().toISOString(),
  };
}

export function restoreProjectItem(project: Project): Project {
  return {
    ...project,
    isDeleted: false,
    updatedAt: new Date().toISOString(),
  };
}

export function findProjectById(projects: Project[], id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function filterActiveProjects(projects: Project[]): Project[] {
  return projects.filter((project) => !project.isDeleted);
}
