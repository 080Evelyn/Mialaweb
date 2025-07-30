import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchPendingRiders = createAsyncThunk(
  "pendingRiders/fetchPendingRiders",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/fetch-all-pending-agent-account`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/fetch-all-pending-agent-account`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/fetch-all-pending-agent-account`
          : `${BASE_URL}api/v1/accountant/fetch-all-pending-agent-account`,

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

const pendingRiderSlice = createSlice({
  name: "pendingRiders",
  initialState: {
    pendingRiders: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPendingRiders(state) {
      state.pendingRiders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRiders = action.payload;
      })
      .addCase(fetchPendingRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetPendingRiders } = pendingRiderSlice.actions;
export default pendingRiderSlice.reducer;
