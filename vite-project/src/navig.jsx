import { useState } from "react";

export default function Registration() {
  return (
    <div>
      <InputReg />
    </div>
  );
}

function InputReg() {
  const [value, setValue] = useState("");
  const [resValue, setResValue] = useState({
    name: "",
    email: "",
    password: "",
    subscribe: false,
  });

  const heidiCheng = (e) => {
    const { name, value, type } = e.target;
    const check = () => {
      if (
        resValue.name.trim().length > 2 &&
        resValue.email.length > 1 &&
        resValue.email.includes("@") &&
        resValue.password.length > 6
      ) {
        return true;
      } else {
        return false;
      }
    };
    setResValue((p) => ({
      ...p,
      [name]: type === "checkbox" ? check() : value,
    }));
    console.log(resValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue([...value, resValue]);
    console.log("Form submitted:", resValue);
    console.log("Form submitted value:", value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={resValue.name}
        onChange={heidiCheng}
      />
      <br />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={resValue.email}
        onChange={heidiCheng}
      />
      <br />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={resValue.password}
        onChange={heidiCheng}
      />
      <br />
      <label>Subscription</label>
      <input
        type="checkbox"
        name="subscribe"
        value={resValue.subscribe}
        onChange={heidiCheng}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
