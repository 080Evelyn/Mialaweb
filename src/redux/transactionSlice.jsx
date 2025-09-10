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
          ? ` ${BASE_URL}api/v1/admin/all-transactions-to-riders-nuban`
          : userRole === "CustomerCare"
          ? ` ${BASE_URL}api/v1/customercare/all-transactions-to-riders-nuban`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/all-transactions-to-riders-nuban`
          : `${BASE_URL}api/v1/accountant/all-transactions-to-riders-nuban`,

        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.data);
      // if (response.data.responseMsg !== "Success")
      //   throw new Error("Failed to fetch transactions");

      return response.data.data;
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
