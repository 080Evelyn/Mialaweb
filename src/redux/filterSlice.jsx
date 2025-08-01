// redux/filterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {}, // This will hold filter values by page
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { page, filterKey, value } = action.payload;
      if (!state.filters[page]) state.filters[page] = {};
      state.filters[page][filterKey] = value;
    },
    resetFilters: (state, action) => {
      const { page } = action.payload;
      state.filters[page] = {};
    },
  },
});

export const { setFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
