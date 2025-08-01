// redux/filterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restricted: false,
};

const restrictionSlice = createSlice({
  name: "restriction",
  initialState,
  reducers: {
    setRestricted: (state, action) => {
      state.restricted = action.payload;
    },
  },
});

export const { setRestricted } = restrictionSlice.actions;
export default restrictionSlice.reducer;
