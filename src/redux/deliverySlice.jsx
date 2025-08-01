import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDelivery = createAsyncThunk(
  "delivery/fetchDelivery",
  async (
    { token, userRole, page = 0, size = 40 },
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

      const url =
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/deliveriy/all?${params}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/deliveriy/all?${params}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/deliveriy/all?${params}`
          : `${BASE_URL}api/v1/accountant/deliveriy/all?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
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
        state.delivery = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
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
