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
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/deliveries/${id}/proposal?adminId=${adminId}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/deliveries/${id}/proposal?adminId=${adminId}`
          : `${BASE_URL}api/v1/accountant/deliveries/${id}/proposal?adminId=${adminId}`,

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

export const fetchProposedOrders = createAsyncThunk(
  "proposedOrders/fetchProposedOrders",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/fee-proposed`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/fee-proposed`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/fee-proposed`
          : `${BASE_URL}api/v1/accountant/fee-proposed`,

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
    proposedOrders: [],
    loadingOrders: false,
    errorOrders: false,
    multiCall: false,
  },
  reducers: {
    resetProposedFee(state) {
      state.proposedFee = [];
      state.loading = false;
      state.error = false;
      proposedOrders = [];
      loadingOrders = false;
      errorOrders = false;
    },
    setMultiCallPropose(state) {
      state.multiCall = true;
    },
    setMultiCallProposeFalse(state) {
      state.multiCall = false;
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
      })
      .addCase(fetchProposedOrders.pending, (state) => {
        state.loadingOrders = true;
        state.errorOrders = false;
      })
      .addCase(fetchProposedOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.proposedOrders = action.payload;
      })
      .addCase(fetchProposedOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.errorOrders = action.payload;
      });
  },
});
export const {
  resetProposedFee,
  setMultiCallProposeFalse,
  setMultiCallPropose,
} = proposedFeeSlice.actions;
export default proposedFeeSlice.reducer;
