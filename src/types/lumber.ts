export interface Lumber {
  id: string;
  name: string;
  description: string;
  jankaRating: number;
  costPerBoardFoot: number;
  tags: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLumberInput {
  name: string;
  description: string;
  jankaRating: number;
  costPerBoardFoot: number;
  tags: string[];
}

export interface UpdateLumberInput {
  id: string;
  name?: string;
  description?: string;
  jankaRating?: number;
  costPerBoardFoot?: number;
  tags?: string[];
}
