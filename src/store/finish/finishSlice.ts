import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Finish, CreateFinishInput, UpdateFinishInput } from '../../types/finish';
import {
  createFinish,
  updateFinishItem,
  softDeleteFinishItem,
  restoreFinishItem,
  findFinishById,
} from './finishLogic';

interface FinishState {
  items: Finish[];
}

const initialState: FinishState = {
  items: [],
};

const finishSlice = createSlice({
  name: 'finish',
  initialState,
  reducers: {
    addFinish: (state, action: PayloadAction<CreateFinishInput>) => {
      const newFinish = createFinish(action.payload);
      state.items.push(newFinish);
    },
    updateFinish: (state, action: PayloadAction<UpdateFinishInput>) => {
      const { id, ...updates } = action.payload;
      const finish = findFinishById(state.items, id);
      if (finish) {
        const updatedFinish = updateFinishItem(finish, updates);
        const index = state.items.findIndex((item) => item.id === id);
        state.items[index] = updatedFinish;
      }
    },
    softDeleteFinish: (state, action: PayloadAction<string>) => {
      const finish = findFinishById(state.items, action.payload);
      if (finish) {
        const deletedFinish = softDeleteFinishItem(finish);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = deletedFinish;
      }
    },
    restoreFinish: (state, action: PayloadAction<string>) => {
      const finish = findFinishById(state.items, action.payload);
      if (finish) {
        const restoredFinish = restoreFinishItem(finish);
        const index = state.items.findIndex((item) => item.id === action.payload);
        state.items[index] = restoredFinish;
      }
    },
    hardDeleteFinish: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  addFinish,
  updateFinish,
  softDeleteFinish,
  restoreFinish,
  hardDeleteFinish,
} = finishSlice.actions;

export default finishSlice.reducer;
