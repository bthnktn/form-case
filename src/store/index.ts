import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PictureData } from "../interfaces/index";

export type StateType = { pictureData: PictureData | null };

const initialState: StateType = {
  pictureData: null,
};

export const picturesslice = createSlice({
  name: "data",
  initialState,
  reducers: {
    picData: (state, action: PayloadAction<PictureData>) => {
      state.pictureData = action.payload;
    },
  },
});
const store = configureStore({
  reducer: {
    pictures: picturesslice.reducer,
  },
});

export default store;

export const { picData } = picturesslice.actions;
