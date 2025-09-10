import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Utility to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// 🔹 Default values: today and one month ago
const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
export const fetchPerformance = createAsyncThunk(
  "delivery/fetchPerformance",
  async ({ token, userRole, startDate, endDate }, { rejectWithValue }) => {
    try {
      const url =
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/list-riders-delivery/performance?startDate=${startDate}&endDate=${endDate}`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/list-riders-delivery/performance?startDate=${startDate}&endDate=${endDate}`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/list-riders-delivery/performance?startDate=${startDate}&endDate=${endDate}`
          : `${BASE_URL}api/v1/accountant/list-riders-delivery/performance?startDate=${startDate}&endDate=${endDate}`;

      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response.data.responseDesc);
    }
  }
);

const performanceSlice = createSlice({
  name: "performance",
  initialState: {
    performance: [],
    loading: false,
    error: null,
    success: false,
    startDate: formatDate(oneMonthAgo),
    endDate: formatDate(today),
  },
  reducers: {
    resetPerformance(state) {
      state.success = false;
      state.error = null;
      state.performance = [];
    },
    setStartDate(state, action) {
      state.startDate = action.payload;
    },
    setEndDate(state, action) {
      state.endDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performance = action.payload;
        state.success = true;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetPerformance, setStartDate, setEndDate } =
  performanceSlice.actions;
export default performanceSlice.reducer;
