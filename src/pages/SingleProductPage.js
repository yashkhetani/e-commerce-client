import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { formatPrice } from "../utils/helpers";
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  Stars,
  PageHero,
  Counter,
} from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getsingleProduct, loadId } from "../redux/product/productSlice";

const SingleProductPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    single_products_loading: loading,
    single_products_error: error,
    single_product,
  } = useSelector((store) => store.product);

  useEffect(() => {
    dispatch(loadId(id));
  }, [dispatch, id]);
  useEffect(() => {
    dispatch(getsingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigate("/");
      }, 7000);
    }
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <>
        <Error />
        <Counter />
      </>
    );
  }

  const { name, price, description, company, image, stars, reviews, stock } =
    single_product;

  return (
    <Wrapper>
      <PageHero title={name} product />
      <div className="section section-center page">
        <Link to="/products" className="btn">
          back to products
        </Link>
        <div className="product-center">
          <ProductImages image={image} />
          <section className="content">
            <h2>{name}</h2>
            <Stars stars={stars} reviews={reviews} />
            <h5 className="price">{formatPrice(price)}</h5>
            <p className="desc">{description}</p>
            <p className="info">
              <span>Available:</span>
              {stock > 0 ? "In stock" : "out of Stock"}
            </p>
            <p className="info">
              <span>Brand:</span>
              {company}
            </p>
            <hr />
            {stock > 0 && <AddToCart single_product={single_product} />}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;

export default SingleProductPage;
