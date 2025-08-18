import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchOrderSummary = createAsyncThunk(
  "payment/fetchOrderSummary",
  async (
    { token, userRole, page = 0, size = 20 },
    { rejectWithValue, getState }
  ) => {
    try {
      const { query, filters } = getState().search;

      // Build query params
      const params = new URLSearchParams({
        page,
        size,
        query,
        status: filters.status || "",
        agent: filters.agent || "",
        state: filters.state || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      });

      const response = await fetch(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/sale-per-product-list?${params}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/sale-per-product-list?${params}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/sale-per-product-list?${params}`
          : `${BASE_URL}api/v1/accountant/sale-per-product-list?${params}`,

        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch order summary");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSummarySlice = createSlice({
  name: "orderSummary",
  initialState: {
    summary: [],
    loading: false,
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    error: null,
    success: false,
    multiCall: false,
  },
  reducers: {
    resetSummary(state) {
      state.summary = [];
      state.success = false;
      state.error = false;
    },
    setMultiCall(state) {
      state.multiCall = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.content;
        state.success = true;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetSummary, setMultiCall } = orderSummarySlice.actions;
export default orderSummarySlice.reducer;
