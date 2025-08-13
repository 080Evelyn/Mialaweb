import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/product/stats/grouped`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/product/stats/grouped`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/product/stats/grouped`
          : `${BASE_URL}api/v1/accountant/product/stats/grouped`,

        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const statSlice = createSlice({
  name: "stats",
  initialState: {
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetStats(state) {
      state.stats = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStats } = statSlice.actions;
export default statSlice.reducer;
