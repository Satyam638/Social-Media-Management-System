import { useState } from "react";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [image, setImage] = useState(null);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);

      if (image) {
        data.append("profileImage", image);
      }

      const response = await api.post(
        "/auth/register",
        data
      );

      alert(response.data.message);

    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

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

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;