import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Tool, CreateToolInput, UpdateToolInput } from '../../types/tool';
import {
  createTool,
  updateToolItem,
  softDeleteToolItem,
  restoreToolItem,
  findToolById,
} from './toolLogic';

interface ToolState {
  items: Tool[];
}

const initialState: ToolState = {
  items: [],
};

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    addTool: (state, action: PayloadAction<CreateToolInput>) => {
      const newTool = createTool(action.payload);
      state.items.push(newTool);
    },
    updateTool: (state, action: PayloadAction<UpdateToolInput & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const tool = findToolById(state.items, id);
      if (tool) {
        const updatedTool = updateToolItem(tool, updates);
        const index = state.items.findIndex((item) => item.id === id);
        state.items[index] = updatedTool;
      }
    },
    softDeleteTool: (state, action: PayloadAction<string>) => {
      const tool = findToolById(state.items, action.payload);
      if (tool) {
        const deletedTool = softDeleteToolItem(tool);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = deletedTool;
      }
    },
    restoreTool: (state, action: PayloadAction<string>) => {
      const tool = findToolById(state.items, action.payload);
      if (tool) {
        const restoredTool = restoreToolItem(tool);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = restoredTool;
      }
    },
    hardDeleteTool: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setTools: (state, action: PayloadAction<Tool[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addTool,
  updateTool,
  softDeleteTool,
  restoreTool,
  hardDeleteTool,
  setTools,
} = toolSlice.actions;

export default toolSlice.reducer;
