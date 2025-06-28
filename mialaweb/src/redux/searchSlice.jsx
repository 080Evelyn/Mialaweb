// // store/searchSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const searchSlice = createSlice({
//   name: "search",
//   initialState: {
//     query: "",
//   },
//   reducers: {
//     setSearchQuery: (state, action) => {
//       state.query = action.payload;
//     },
//     clearSearchQuery: (state) => {
//       state.query = "";
//     },
//   },
// });

// export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
// export default searchSlice.reducer;

// store/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    filters: {
      status: "",
      agent: "",
      state: "",
      startDate: "",
      endDate: "",
    },
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = "";
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearFilters: (state) => {
      state.filters = {
        status: "",
        agent: "",
        state: "",
        startDate: "",
        endDate: "",
      };
    },
  },
});

export const { setSearchQuery, clearSearchQuery, setFilters, clearFilters } =
  searchSlice.actions;
export default searchSlice.reducer;
