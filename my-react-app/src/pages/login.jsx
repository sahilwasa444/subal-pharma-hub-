import { useState } from "react";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  }

  function handleSubmit(event) {

    event.preventDefault();

    console.log(formData);

    alert("Login Successful");

  }

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;