import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "forgotpassword",
  initialState: {
    step: 0,
  },
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    resetStep: (state) => {
      state.step = 0;
    },
  },
});

export const { setStep } = searchSlice.actions;
export default searchSlice.reducer;
