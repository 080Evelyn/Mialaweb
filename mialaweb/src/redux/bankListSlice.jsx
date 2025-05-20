import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchBankList = createAsyncThunk(
  "bankList/fetchBankList",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await fetch(` ${BASE_URL}api/v1/auth/banks-list`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch Bank list");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bankListSlice = createSlice({
  name: "bankList",
  initialState: {
    bankList: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetbankList(state) {
      state.bankList = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBankList.fulfilled, (state, action) => {
        state.loading = false;
        state.bankList = action.payload;
        state.success = true;
      })
      .addCase(fetchBankList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetbankList } = bankListSlice.actions;
export default bankListSlice.reducer;
