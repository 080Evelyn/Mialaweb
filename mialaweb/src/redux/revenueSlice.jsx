import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchRevenue = createAsyncThunk(
  "revenue/fetchRevenue",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/transaction-summary-and-revenue`
          : `${BASE_URL}api/v1/subadmin/transaction-summary-and-revenue`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch revenue");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    revenue: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetRevenue(state) {
      state.revenue = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
        state.success = true;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetRevenue } = revenueSlice.actions;
export default revenueSlice.reducer;
