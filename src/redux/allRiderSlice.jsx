import { BASE_URL } from "@/lib/Api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch transactions
export const fetchAllRiders = createAsyncThunk(
  "riders/fetchAllRiders",
  async ({ token, userRole, navigate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        userRole === "Admin"
          ? `${BASE_URL}api/v1/admin/list-riders`
          : userRole === "CustomerCare"
          ? `${BASE_URL}api/v1/customercare/list-riders`
          : userRole === "Manager"
          ? `${BASE_URL}api/v1/manager/list-riders`
          : `${BASE_URL}api/v1/accountant/list-riders`,

        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 401 && navigate) {
        navigate("/login");
      }
      if (!response.ok) throw new Error("Failed to fetch riders");
      const data = await response.json();

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const allRiderSlice = createSlice({
  name: "allRiders",
  initialState: {
    allRiders: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAllriders(state) {
      state.allRiders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.allRiders = action.payload;
      })
      .addCase(fetchAllRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetAllriders } = allRiderSlice.actions;
export default allRiderSlice.reducer;
