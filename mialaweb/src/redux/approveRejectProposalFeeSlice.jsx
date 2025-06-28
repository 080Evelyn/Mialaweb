import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const approveProposalFee = createAsyncThunk(
  "proposedFee/approveRejectProposalFee",
  async ({ token, userRole, id, adminId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/approve-fee/${adminId}/${id}?approved=true`
          : `${BASE_URL}api/v1/subadmin/approve-fee/${adminId}/${id}?approved=true`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

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

export const rejectProposalFee = createAsyncThunk(
  "rejectproposedFee/rejectProposalFee",
  async ({ token, userRole, id, adminId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/approve-fee/${adminId}/${id}?approved=false`
          : `${BASE_URL}api/v1/subadmin/approve-fee/${adminId}/${id}?approved=false`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        console.log(data);
        // Pass backend message if it exists
        return rejectWithValue(data.responseDesc || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.log(error);
      // Network error or unexpected exception
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const approveRejectProposalFeeSlice = createSlice({
  name: "approveRejectProposalFee",
  initialState: {
    approve: false,
    approveLoading: false,
    rejectLoading: false,
    error: false,
    reject: false,
    success: false,
  },
  reducers: {
    resetApproveReject(state) {
      state.approve = false;
      state.approveLoading = false;
      state.rejectLoading = false;
      state.error = false;
      state.reject = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveProposalFee.pending, (state) => {
        state.approveLoading = true;
        state.success = false;
      })
      .addCase(approveProposalFee.fulfilled, (state, action) => {
        state.approveLoading = false;
        state.proposedFee = action.payload;
        state.success = true;
      })
      .addCase(approveProposalFee.rejected, (state, action) => {
        state.approveLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(rejectProposalFee.pending, (state) => {
        state.rejectLoading = true;
        state.success = false;
      })
      .addCase(rejectProposalFee.fulfilled, (state, action) => {
        state.rejectLoading = false;
        state.proposedFee = action.payload;
        state.success = true;
      })
      .addCase(rejectProposalFee.rejected, (state, action) => {
        state.rejectLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetApproveReject } = approveRejectProposalFeeSlice.actions;
export default approveRejectProposalFeeSlice.reducer;
