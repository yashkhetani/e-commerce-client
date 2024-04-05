import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./product/productSlice";
import AuthSlice from "./Auth.js/AuthSlice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    auth: AuthSlice,
  },
});
