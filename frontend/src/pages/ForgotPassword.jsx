import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.newPassword) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        {
          email: formData.email,
          password: formData.newPassword,
        }
      );

      alert(response.data.message);

      // Clear form
      setFormData({
        email: "",
        newPassword: "",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="update-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;