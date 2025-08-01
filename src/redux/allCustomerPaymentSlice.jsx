import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchAllPayment = createAsyncThunk(
  "payment/fetchAllPayment",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/get-all-customer-payments`
          : `${BASE_URL}api/v1/subadmin/get-all-customer-payments`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const allCustomerPaymentSlice = createSlice({
  name: "payment",
  initialState: {
    payment: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPayment(state) {
      state.payment = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.success = true;
      })
      .addCase(fetchAllPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetPayment } = allCustomerPaymentSlice.actions;
export default allCustomerPaymentSlice.reducer;
