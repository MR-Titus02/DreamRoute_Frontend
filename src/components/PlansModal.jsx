import React, { useState } from "react";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    name: "Free",
    price: "Free",
    description: "Start your career journey with limited access.",
    features: ["Basic Roadmaps", "Limited Courses"],
    isPaid: false,
  },
  {
    name: "Pro",
    price: "USD 9.99/month",
    description: "Unlock full roadmap guidance and smart suggestions.",
    features: ["Advanced Roadmaps", "Smart Suggestions", "Priority Support"],
    isPaid: true,
    priceId: "price_1RlNC7B7LCNwTzAibT4mDcY9",
  },
];

const PlansModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubscribe = async (priceId) => {
    if (!user) {
      setError("Please sign in to continue with checkout.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/payment/create-checkout-session", {
        priceId,
        userId: user.id,
        plan: "pro",
      });

      const stripe = await stripePromise;
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (redirectError) throw redirectError;
    } catch (error) {
      console.error("Stripe checkout error:", error);
      setError("Checkout couldn't be started. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim background */}
      <button
        type="button"
        aria-label="Dismiss plan selection"
        className="absolute inset-0 z-40 cursor-default bg-black/60"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plans-title"
        className="relative z-50 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close plan selection"
          className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X size={24} />
        </button>

        <h2 id="plans-title" className="mb-8 text-center text-3xl font-bold text-foreground">
          Choose Your Plan
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-xl border border-border bg-background p-6 shadow-sm"
            >
              <div>
                <h3 className="text-xl font-semibold text-primary">
                  {plan.name}
                </h3>
                <p className="text-2xl font-bold mt-2">{plan.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground">
                      <span className="text-success" aria-hidden="true">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                {plan.isPaid ? (
                  <button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    {loading ? "Redirecting..." : "Subscribe to Pro"}
                  </button>
                ) : (
                  <span className="block cursor-default rounded-xl bg-muted py-2 text-center font-semibold text-muted-foreground">
                    ✅ Current Plan
                  </span>
                )}
              </div>
              {error && (
                <p role="alert" className="mt-6 text-center text-sm text-error">
                  {error}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansModal;
