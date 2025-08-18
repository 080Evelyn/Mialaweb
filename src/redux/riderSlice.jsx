import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchRiders = createAsyncThunk(
  "riders/fetchRiders",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        // userRole === "Admin"
        //   ? `${BASE_URL}api/v1/admin/riders-by-state`
        //   : userRole === "CustomerCare"
        //   ? `${BASE_URL}api/v1/customercare/riders-by-state`
        //   : userRole === "Manager"
        //   ? `${BASE_URL}api/v1/manager/riders-by-state`
        //   : `${BASE_URL}api/v1/accountant/riders-by-state`,
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/list-riders`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/list-riders`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/list-riders`
          : `${BASE_URL}api/v1/accountant/list-riders`,

        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch riders");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const riderSlice = createSlice({
  name: "riders",
  initialState: {
    riders: null,
    loading: false,
    error: null,
    multiCall: false,
  },
  reducers: {
    resetriders(state) {
      state.riders = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetriders } = riderSlice.actions;
export default riderSlice.reducer;
