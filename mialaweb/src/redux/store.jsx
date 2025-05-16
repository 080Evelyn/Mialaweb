// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import authReducer from "./authSlice";
import deliveryReducer from "./deliverySlice";
import productReducer from "./productSlice";
import riderReducer from "./riderSlice";
import subAdminReducer from "./subadminSlice";
import searchReducer from "./searchSlice";
import transactionReducer from "./transactionSlice";
import allPaymentReducer from "./allCustomerPaymentSlice";
import riderByIdReducer from "./riderByIdSlice";
import bankListReducer from "./bankListSlice";
import pendingRiderReducer from "./pendingRidersSlice";
import allRidersReducer from "./allRiderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  delivery: deliveryReducer,
  product: productReducer,
  riders: riderReducer,
  subadmin: subAdminReducer,
  search: searchReducer,
  transaction: transactionReducer,
  payment: allPaymentReducer,
  riderById: riderByIdReducer,
  bankList: bankListReducer,
  pendingRiders: pendingRiderReducer,
  allRiders: allRidersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "bankList"], // only persist auth reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist action types to ignore
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
