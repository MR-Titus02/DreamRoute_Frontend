// pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-20 relative">
      {/* Back Button top-left */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to="/login" label="Back" />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 rounded-lg bg-card border border-border shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <label htmlFor="reset-password" className="sr-only">New password</label>
        <input
          id="reset-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          className="w-full px-4 py-2 rounded bg-background border border-input text-foreground placeholder:text-muted-foreground mb-3"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Resetting…" : "Reset Password"}
        </button>

        {message && (
          <p role="status" className="text-success mt-3 text-center">{message}</p>
        )}
        {error && <p role="alert" className="text-error mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
