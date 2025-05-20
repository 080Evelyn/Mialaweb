import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchDelivery = createAsyncThunk(
  "delivery/fetchDelivery",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/delivery/all-rider-deliveries`
          : `${BASE_URL}api/v1/subadmin/delivery/all-rider-deliveries`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch deliveries");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    delivery: [],
    loading: false,
    error: null,
    success: false,
    multiCall: false,
  },
  reducers: {
    resetDelivery(state) {
      state.delivery = [];
      state.multiCall = false;
      state.success = false;
    },
    setMultiCall(state) {
      state.multiCall = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDelivery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.delivery = action.payload;
        state.success = true;
      })
      .addCase(fetchDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetDelivery, setMultiCall } = deliverySlice.actions;
export default deliverySlice.reducer;
