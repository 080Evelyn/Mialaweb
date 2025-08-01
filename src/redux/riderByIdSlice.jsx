import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchRidersById = createAsyncThunk(
  "ridersById/fetchRidersById",
  async ({ token, userRole, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/rider-by-id/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/rider-by-id/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/rider-by-id/${id}`
          : `${BASE_URL}api/v1/accountant/rider-by-id/${id}`,

        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch rider");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const riderByIdSlice = createSlice({
  name: "riderById",
  initialState: {
    riderById: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetriderById(state) {
      state.riderById = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRidersById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRidersById.fulfilled, (state, action) => {
        state.loading = false;
        state.riderById = action.payload;
      })
      .addCase(fetchRidersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetriderById } = riderByIdSlice.actions;
export default riderByIdSlice.reducer;
