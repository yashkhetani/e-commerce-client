import React from "react";

const TimeOutErrorPage = () => {
  let value = 5;
  setInterval(() => {
    value--;
    <h1>{value}</h1>;
  }, 1000);
};

export default TimeOutErrorPage;
