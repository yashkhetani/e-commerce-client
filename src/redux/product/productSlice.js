import customFetch from "../../utils/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialFilterState = {
  search: "",
  category: "All",
  company: "All",
  price: "0",
  min_price: "0",
  max_price: "400000",
};
const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
  listview: false,
  sort: "",
  id: "",
  ...initialFilterState,
};

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, thunkAPI) => {
    const { sort, search, category, company, price } =
      thunkAPI.getState().product;
    let url = `/products?sort=${sort}&category=${category}&company=${company}&price=${price}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    try {
      const resp = await customFetch.get(url);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getsingleProduct = createAsyncThunk(
  "product/getsingleProduct",
  async (_, thunkAPI) => {
    const { id } = thunkAPI.getState().product;

    let url = `/products/${id}`;
    try {
      const resp = await customFetch.get(url);

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getProductsforfilter = createAsyncThunk(
  "product/getProductsforfilter",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get("/products");
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    togglelistview: (state, { payload }) => {
      state.listview = payload;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    loadId: (state, { payload }) => {
      state.id = payload;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFilterState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.featured_products = payload;
      })
      .addCase(getProducts.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(getsingleProduct.pending, (state) => {
        state.single_product_loading = true;
      })
      .addCase(getsingleProduct.fulfilled, (state, { payload }) => {
        state.single_product_loading = false;
        state.single_product = payload;
      })
      .addCase(getsingleProduct.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.single_product_error = true;
        toast.error(payload);
      })
      .addCase(getProductsforfilter.fulfilled, (state, { payload }) => {
        state.single_product_loading = false;
        state.products = payload;
      })
      .addCase(getProductsforfilter.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.single_product_error = true;
        toast.error(payload);
      });
  },
});

export const { togglelistview, handleChange, loadId, clearFilters } =
  productsSlice.actions;
export default productsSlice.reducer;
