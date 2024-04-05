import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getUniqueValues } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilters,
  getProductsforfilter,
  handleChange,
} from "../redux/product/productSlice";
import FormRowSelect from "./FormRowSelect";

const Filters = () => {
  const [localSearch, setLocalSearch] = useState("");
  const { products, category, company, price, min_price, max_price } =
    useSelector((store) => store.product);

  const categories = getUniqueValues(products, "category");
  const companies = getUniqueValues(products, "company");

  if (categories.length <= 1 || categories === null) {
    const refreshPage = setTimeout(() => {
      window.location.reload();
    }, 1000);
    clearTimeout(refreshPage);
  }
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsforfilter());
  }, [dispatch]);

  const handleInputChange = (e) => {
    dispatch(handleChange({ name: e.target.name, value: e.target.innerText }));
  };
  const handleSearch = (e) => {
    dispatch(handleChange({ name: e.target.name, value: e.target.value }));
  };
  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        dispatch(handleChange({ name: e.target.name, value: e.target.value }));
      }, 100);
    };
  };

  // eslint-disable-next-line
  const optimizedDebounce = useMemo(() => debounce(), []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // setLocalSearch("");
    dispatch(clearFilters());
  };

  return (
    <Wrapper>
      <div className="content">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* search input */}
          <div className="form-control">
            <input
              type="text"
              name="search"
              value={localSearch}
              placeholder="search"
              className="search-input"
              onChange={optimizedDebounce}
            />
          </div>
          {/* end of search input */}
          {/* category */}
          <div className="form-control">
            <h5>category</h5>
            <div>
              {categories.map((c, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    name="category"
                    className={`${
                      category.toLowerCase() === c.toLowerCase()
                        ? "active"
                        : null
                    }`}
                    onClick={handleInputChange}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          {/* end of category */}
          {/* company component*/}
          <div className="form-control">
            <h5>company</h5>
            <FormRowSelect
              name="company"
              value={company}
              handleChange={handleSearch}
              list={[...companies]}
            />
          </div>

          {/* end of company c*/}

          {/* price */}
          <div className="form-control">
            <h5>price</h5>
            <p className="price">{`$ ${price / 100}`}</p>
            <input
              type="range"
              name="price"
              onChange={handleSearch}
              min={min_price}
              max={max_price}
              value={price}
            />
          </div>
          {/* end of price */}
        </form>
        <button
          type="button"
          name="clear"
          className="clear-btn"
          onClick={handleSubmit}
        >
          clear filters
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors {
    display: flex;
    align-items: center;
  }
  .color-btn {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.5rem;
      color: var(--clr-white);
    }
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }
  .price {
    margin-bottom: 0.25rem;
  }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
    max-width: 200px;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`;

export default Filters;
