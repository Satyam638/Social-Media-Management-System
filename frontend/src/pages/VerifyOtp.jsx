import { useState } from "react";
import api from "../services/api";

function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  async function handleVerify(e) {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.log(error);
      alert("Verification Failed");
    }
  }

  return (
    <form onSubmit={handleVerify}>
      <h1>Verify OTP</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button>
        Verify
      </button>
    </form>
  );
}

export default VerifyOtp;