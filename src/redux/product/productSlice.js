import customFetch from "../../utils/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialFilterState = {
  search: "",
  category: "All",
  company: "All",
  price: "4000000",
  min_price: "0",
  max_price: "400000",
};
const initialState = {
  cart: [],
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
  count: 1,
  total_items: 0,
  total_amount: 0,
  shipping_fee: 2500,
  sameitems: [],
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

export const addToCart = createAsyncThunk(
  "product/addToCart",
  async (_, thunkAPI) => {
    const { id } = thunkAPI.getState().product;
    const { name } = thunkAPI.getState().auth.user;

    try {
      const resp = await customFetch.post(`/products/${id}`, { id, name });
      thunkAPI.dispatch(getCart());
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getCart = createAsyncThunk(
  "product/getCart",
  async (_, thunkAPI) => {
    const { name } = thunkAPI.getState().auth.user;
    try {
      const resp = await customFetch.post("/cart", { name });
      return resp.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const removeProductFromCart = createAsyncThunk(
  "product/removeProductFromCart",
  async ({ name, id }, thunkAPI) => {
    try {
      const resp = await customFetch.post("/removeproduct", { name, id });
      thunkAPI.dispatch(getCart());
      return resp.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const clearCart = createAsyncThunk(
  "product/clearCart",
  async (_, thunkAPI) => {
    const { name } = thunkAPI.getState().auth.user;
    try {
      const resp = await customFetch.post("/clearcart", { name });

      return resp.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

//slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
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
    cartTotal: (state) => {
      const { total_items, total_amount } = state.cart.reduce(
        (total, cartItem) => {
          const { price } = cartItem;
          const amount = 1;
          total.total_items += amount;
          total.total_amount += price * amount;
          return total;
        },
        { total_items: 0, total_amount: 0 }
      );
      return { ...state, total_items, total_amount };
    },
    SameItems: (state) => {
      const counts = state.cart.reduce((acc, curr) => {
        const id = curr.id;
        acc[id] = acc[id] ? acc[id] + 1 : 1;
        return acc;
      }, {});
      state.sameitems = counts;
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
      })
      .addCase(addToCart.fulfilled, (state) => {
        toast.success("added to cart");
      })
      .addCase(addToCart.rejected, () => {
        toast.error("something went wrong!");
      })

      .addCase(getCart.fulfilled, (state, { payload }) => {
        state.cart = payload;
      })
      .addCase(getCart.rejected, ({ payload }) => {
        toast.error(payload);
      })
      .addCase(clearCart.fulfilled, (state, { payload }) => {
        state.cart = [];
        toast.success(payload);
      })
      .addCase(removeProductFromCart.fulfilled, ({ payload }) => {
        toast.success(payload);
      });
  },
});

export const {
  togglelistview,
  handleChange,
  loadId,
  clearFilters,
  openSidebar,
  closeSidebar,
  cartTotal,
  SameItems,
} = productsSlice.actions;
export default productsSlice.reducer;
