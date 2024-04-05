import React, { useState, useEffect } from "react";

function Counter() {
  const [valve, setValve] = useState(7);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValve((valve) => valve - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="section-center">
      <h5 className="counter">redirect to home in {valve} second</h5>
    </div>
  );
}

export default Counter;
