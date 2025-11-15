import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lumber, CreateLumberInput, UpdateLumberInput } from '../../types/lumber';
import {
  createLumber,
  updateLumberItem,
  softDeleteLumberItem,
  restoreLumberItem,
  findLumberById,
} from './lumberLogic';

interface LumberState {
  items: Lumber[];
}

const initialState: LumberState = {
  items: [],
};

const lumberSlice = createSlice({
  name: 'lumber',
  initialState,
  reducers: {
    addLumber: (state, action: PayloadAction<CreateLumberInput>) => {
      const newLumber = createLumber(action.payload);
      state.items.push(newLumber);
    },
    updateLumber: (state, action: PayloadAction<UpdateLumberInput>) => {
      const { id, ...updates } = action.payload;
      const lumber = findLumberById(state.items, id);
      if (lumber) {
        const updatedLumber = updateLumberItem(lumber, updates);
        const index = state.items.findIndex((item) => item.id === id);
        state.items[index] = updatedLumber;
      }
    },
    softDeleteLumber: (state, action: PayloadAction<string>) => {
      const lumber = findLumberById(state.items, action.payload);
      if (lumber) {
        const deletedLumber = softDeleteLumberItem(lumber);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = deletedLumber;
      }
    },
    restoreLumber: (state, action: PayloadAction<string>) => {
      const lumber = findLumberById(state.items, action.payload);
      if (lumber) {
        const restoredLumber = restoreLumberItem(lumber);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = restoredLumber;
      }
    },
    hardDeleteLumber: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  addLumber,
  updateLumber,
  softDeleteLumber,
  restoreLumber,
  hardDeleteLumber,
} = lumberSlice.actions;

export default lumberSlice.reducer;
