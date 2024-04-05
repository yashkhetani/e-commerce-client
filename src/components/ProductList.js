import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import GridView from "./GridView";
import ListView from "./ListView";
import { useDispatch } from "react-redux";
import { getProducts } from "../redux/product/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    products_loading: loading,
    products_error: error,
    featured_products,
    listview,
    sort,
    search,
    category,
    company,
    price,
  } = useSelector((store) => store.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch, sort, search, category, company, price]);

  if (featured_products.length < 1) {
    return (
      <h5 style={{ textTransform: "none" }}>
        Sorry,no products matched your search...
      </h5>
    );
  }
  if (listview === true) {
    return <ListView featured_products={featured_products} />;
  }
  return (
    <GridView featured_products={featured_products}>product list</GridView>
  );
};

export default ProductList;
