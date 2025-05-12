import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchProducts = createAsyncThunk(
  "transactions/fetchProducts",
  async ({ token, page, userRole }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/all-created-product?page=${page}&size=${20}`
          : `${BASE_URL}api/v1/subadmin/all-created-product?page=${page}&size=${20}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
    // hasMoreCredit: true,
    // hasMoreDebit: true,
  },
  reducers: {
    resetProducts(state) {
      // Reset state for both credit and debit transactions
      state.products = [];
      //   state.debits = [];
      //   state.currentCreditPage = 1;
      //   state.hasMoreCredit = true;
      //   state.hasMoreDebit = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // // Deduplicate Credit Transactions
        // const newCredits = action.payload.content.filter(
        //   (newTxn) => !state.credits.some((txn) => txn.id === newTxn.id)
        // );
        // state.credits = [...state.credits, ...newCredits];
        // if (action.payload.last || action.payload.content.length === 50) {
        //   state.hasMoreCredit = false; // No more data if fewer than 10 items are returned
        // }
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
