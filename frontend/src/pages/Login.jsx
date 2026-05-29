import { useState } from "react";
import api from "../services/api";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const response = await api.post(
        "/auth/login",
        formData
      );

      alert(response.data.message);

      console.log(response.data);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Login Failed"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button>
        Login
      </button>
    </form>
  );
}

export default Login;