import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Login() {
  const { login } = useContext(AuthContext);
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

    try {
      const response=await api.post("/auth/login",formData);
      login(response.data.user);
    localStorage.setItem("token",response.data.token);
    alert("login succes");
    } catch(error){
      alert(error.response.data.message);
    }
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
}
export default Login;