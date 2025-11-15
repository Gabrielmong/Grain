import type { Lumber } from './lumber';

// 1 Costa Rican vara = 33 inches (0.8382 meters)
export const VARA_TO_INCHES = 33;

export interface Board {
  id: string;
  width: number;
  thickness: number;
  length: number;
  quantity: number;
  lumberId: string;
  lumber?: Lumber;
  boardFeet: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  boards: Board[];
  finishIds?: string[]; // array of finish IDs (for form input)
  finishes?: Array<{ id: string; name: string; price: number }>; // populated finishes from backend
  laborCost: number;
  miscCost: number;
  additionalNotes?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardInput {
  width: number;
  thickness: number;
  length: number;
  quantity: number;
  lumberId: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  boards: CreateBoardInput[];
  finishIds: string[];
  laborCost: number;
  miscCost: number;
  additionalNotes?: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  boards?: CreateBoardInput[];
  finishIds?: string[];
  laborCost?: number;
  miscCost?: number;
  additionalNotes?: string;
}

// Calculation helpers
export function calculateBoardFootage(board: Board): number {
  const lengthInInches = board.length * VARA_TO_INCHES;
  const boardFeet = (board.width * board.thickness * lengthInInches) / 144;
  return boardFeet * board.quantity;
}

export function calculateTotalBoardFootage(boards: Board[]): number {
  return boards.reduce((total, board) => total + calculateBoardFootage(board), 0);
}
