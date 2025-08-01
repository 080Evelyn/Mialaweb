import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchDeliveriesByState = createAsyncThunk(
  "deliveriesByState/fetchDeliveriesByState",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delivery-ranking-by-rider-state`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delivery-ranking-by-rider-state`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delivery-ranking-by-rider-state`
          : `${BASE_URL}api/v1/accountant/delivery-ranking-by-rider-state`,

        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch deliveries by state");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deliveriesByStateSlice = createSlice({
  name: "deliveriesByState",
  initialState: {
    deliveriesByState: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetdeliveriesByState(state) {
      state.deliveriesByState = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveriesByState.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveriesByState.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveriesByState = action.payload;
      })
      .addCase(fetchDeliveriesByState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetdeliveriesByState } = deliveriesByStateSlice.actions;
export default deliveriesByStateSlice.reducer;
