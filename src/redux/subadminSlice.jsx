import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchSubadmin = createAsyncThunk(
  "subadmin/fetchSubadmin",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/staffs`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/staffs`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/staffs`
          : `${BASE_URL}api/v1/accountant/staffs`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch subadmins");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subadminSlice = createSlice({
  name: "subadmin",
  initialState: {
    subadmin: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSubadmin(state) {
      state.subadmin = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubadmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubadmin.fulfilled, (state, action) => {
        state.loading = false;
        state.subadmin = action.payload;
        state.success = true;
      })
      .addCase(fetchSubadmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetSubadmin } = subadminSlice.actions;
export default subadminSlice.reducer;
