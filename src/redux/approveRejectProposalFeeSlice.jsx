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
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/approve-fee/${adminId}/${id}?approved=false`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/approve-fee/${adminId}/${id}?approved=false`
          : `${BASE_URL}api/v1/accountant/approve-fee/${adminId}/${id}?approved=false`,

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
      // console.log(data);
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
    rejectSuccess: false,
    success: false,
  },
  reducers: {
    resetApproveSuccess(state) {
      state.approve = false;
      state.approveLoading = false;
      state.SuccessLoading = false;
      state.error = false;
      state.rejectSuccess = false;
      state.success = false;
    },

    resetApproveRejectState(state) {
      state.success = false;
      state.rejectSuccess = false;
      state.error = false;
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
        state.rejectSuccess = false;
      })
      .addCase(rejectProposalFee.fulfilled, (state, action) => {
        state.rejectLoading = false;
        state.proposedFee = action.payload;
        state.rejectSuccess = true;
      })
      .addCase(rejectProposalFee.rejected, (state, action) => {
        state.rejectLoading = false;
        state.error = action.payload;
        state.rejectSuccess = false;
      });
  },
});
export const { resetApproveReject, resetApproveRejectState } =
  approveRejectProposalFeeSlice.actions;
export default approveRejectProposalFeeSlice.reducer;
