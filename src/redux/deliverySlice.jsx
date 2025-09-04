import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDelivery = createAsyncThunk(
  "delivery/fetchDelivery",
  async (
    { token, userRole, page = 0, size = 50 },
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
        // userRole === "Admin"
        //   ? `${BASE_URL}api/v1/admin/view-all/deliveries?${params}`
        //   : userRole === "CustomerCare"
        //   ? `${BASE_URL}api/v1/customercare/view-all/deliveries?${params}`
        //   : userRole === "Manager"
        //   ? `${BASE_URL}api/v1/manager/view-all/deliveries?${params}`
        //   : `${BASE_URL}api/v1/accountant/view-all/deliveries?${params}`;
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delivery-view-summaries?${params}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delivery-view-summaries?${params}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delivery-view-summaries?${params}`
          : `${BASE_URL}api/v1/accountant/delivery-view-summaries?${params}`;

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

export const fetchDeliveryById = createAsyncThunk(
  "deliveryById/fetchDeliveryById",
  async ({ token, userRole, id }, { rejectWithValue }) => {
    try {
      const url =
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/delivery/${id}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/delivery/${id}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/delivery/${id}`
          : `${BASE_URL}api/v1/accountant/delivery/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
    details: [],
    delivery: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    idLoading: false,
    idError: null,
    error: null,
    success: false,
    multiCall: false,
  },
  reducers: {
    resetDelivery(state) {
      state.delivery = [];
      state.multiCall = false;
      state.success = false;
      state.error = null;
      state.idError = null;
      state.idLoading = false;
      state.details = [];
    },
    setMultiCall(state) {
      state.multiCall = true;
    },
    setMultiCallFalse(state) {
      state.multiCall = false;
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
      })
      .addCase(fetchDeliveryById.pending, (state) => {
        state.idLoading = true;
      })
      .addCase(fetchDeliveryById.fulfilled, (state, action) => {
        state.idLoading = false;
        state.details = action.payload;
      })

      .addCase(fetchDeliveryById.rejected, (state, action) => {
        state.idLoading = false;
        state.idError = action.payload;
      });
  },
});
export const { resetDelivery, setMultiCall, setMultiCallFalse } =
  deliverySlice.actions;
export default deliverySlice.reducer;
