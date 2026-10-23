import React, { useState } from "react";
import api from "../api/axios";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-20 relative">
      {/* ✅ Back Button Top-Left */}
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
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm mb-4 text-muted-foreground text-center">
          Enter your email to receive a password reset link.
        </p>

        <label htmlFor="forgot-email" className="sr-only">Email address</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full px-4 py-2 rounded bg-background border border-input text-foreground placeholder:text-muted-foreground mb-3"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send Reset Link"}
        </button>

        {message && (
          <p role="status" className="text-success mt-3 text-center">{message}</p>
        )}
        {error && <p role="alert" className="text-error mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default ForgotPassword;
