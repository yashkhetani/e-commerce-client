const FormRowSelect = ({ name, value, handleChange, list }) => {
  return (
    <>
      <select
        name={name}
        value={value}
        id={name}
        onChange={handleChange}
        className="company"
      >
        {list.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default FormRowSelect;
