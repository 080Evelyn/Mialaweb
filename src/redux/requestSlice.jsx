import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks to fetch transactions
export const fetchRequest = createAsyncThunk(
  "request/fetchRequest",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/deletion/requests`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/deletion/requests`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/deletion/requests`
          : `${BASE_URL}api/v1/accountant/deletion/requests`,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.responseDesc);
    }
  }
);

const requestSlice = createSlice({
  name: "request",
  initialState: {
    request: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetRequest(state) {
      state.request = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.request = action.payload;
        state.success = true;
      })
      .addCase(fetchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetRequest } = requestSlice.actions;
export default requestSlice.reducer;
