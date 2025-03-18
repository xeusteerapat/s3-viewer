import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type S3State = {
  selectedBucket: string | null;
  selectedObject: string | null;
};

const initialState: S3State = {
  selectedBucket: null,
  selectedObject: null,
};

export const s3Slice = createSlice({
  name: 's3',
  initialState,
  reducers: {
    selectBucket: (state, action: PayloadAction<string>) => {
      state.selectedBucket = action.payload;
      state.selectedObject = null;
    },
    selectObject: (state, action: PayloadAction<string>) => {
      state.selectedObject = action.payload;
    },
    clearSelection: (state) => {
      state.selectedBucket = null;
      state.selectedObject = null;
    },
  },
});

export const { selectBucket, selectObject, clearSelection } = s3Slice.actions;
export default s3Slice.reducer;
