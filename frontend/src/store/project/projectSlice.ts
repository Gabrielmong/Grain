import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../../types/project';
import {
  createProject,
  updateProjectItem,
  softDeleteProjectItem,
  restoreProjectItem,
  findProjectById,
} from './projectLogic';

interface ProjectState {
  items: Project[];
  filters: {
    searchValue: string;
    sortValue: string;
    activeFilters: Record<string, string[]>;
    showDeleted: boolean;
  };
}

const initialState: ProjectState = {
  items: [],
  filters: {
    searchValue: '',
    sortValue: 'name-asc',
    activeFilters: { status: [] },
    showDeleted: false,
  },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<CreateProjectInput>) => {
      const newProject = createProject(action.payload);
      state.items.push(newProject);
    },
    updateProject: (state, action: PayloadAction<UpdateProjectInput>) => {
      const { id, ...updates } = action.payload;
      const project = findProjectById(state.items, id);
      if (project) {
        const updatedProject = updateProjectItem(project, updates);
        const index = state.items.findIndex((item) => item.id === id);
        state.items[index] = updatedProject;
      }
    },
    softDeleteProject: (state, action: PayloadAction<string>) => {
      const project = findProjectById(state.items, action.payload);
      if (project) {
        const deletedProject = softDeleteProjectItem(project);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = deletedProject;
      }
    },
    restoreProject: (state, action: PayloadAction<string>) => {
      const project = findProjectById(state.items, action.payload);
      if (project) {
        const restoredProject = restoreProjectItem(project);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = restoredProject;
      }
    },
    hardDeleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.filters.searchValue = action.payload;
    },
    setSortValue: (state, action: PayloadAction<string>) => {
      state.filters.sortValue = action.payload;
    },
    setActiveFilters: (state, action: PayloadAction<Record<string, string[]>>) => {
      state.filters.activeFilters = action.payload;
    },
    setShowDeleted: (state, action: PayloadAction<boolean>) => {
      state.filters.showDeleted = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addProject,
  updateProject,
  softDeleteProject,
  restoreProject,
  hardDeleteProject,
  setSearchValue,
  setSortValue,
  setActiveFilters,
  setShowDeleted,
  resetFilters,
} = projectSlice.actions;

export default projectSlice.reducer;
