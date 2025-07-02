import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks to fetch transactions
export const fetchTransaction = createAsyncThunk(
  "transactions/fetchTransaction",
  async ({ token, userRole }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        userRole === "Admin"
          ? ` ${BASE_URL}api/v1/admin/all-transactions-to-riders`
          : ` ${BASE_URL}api/v1/subadmin/all-transactions-to-riders`,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.responseDesc);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetTransaction(state) {
      state.transactions = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.success = true;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});
export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
