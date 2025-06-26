import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchProposedFee = createAsyncThunk(
  "proposedFee/fetchProposedFee",
  async ({ token, userRole, id, adminId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/deliveries/${id}/proposal?adminId=${adminId}`
          : `${BASE_URL}api/v1/subadmin/deliveries/${id}/proposal?adminId=${adminId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        // Pass backend message if it exists
        return rejectWithValue(data.responseDesc || "Something went wrong");
      }

      return data.data;
    } catch (error) {
      console.log(error);
      // Network error or unexpected exception
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const proposedFeeSlice = createSlice({
  name: "proposedFee",
  initialState: {
    proposedFee: [],
    loading: false,
    error: false,
  },
  reducers: {
    resetProposedFee(state) {
      state.proposedFee = [];
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposedFee.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProposedFee.fulfilled, (state, action) => {
        state.loading = false;
        state.proposedFee = action.payload;
      })
      .addCase(fetchProposedFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetProposedFee } = proposedFeeSlice.actions;
export default proposedFeeSlice.reducer;
