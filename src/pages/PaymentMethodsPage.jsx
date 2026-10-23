import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : Promise.resolve(null);

const priceMap = {
  basic: null,
  pro: 'price_1RlNC7B7LCNwTzAibT4mDcY9',
  premium: 'price_1RlNCNB7LCNwTzAiIjn7LENH',
};

export default function PaymentMethodsPage() {
  const [plan, setPlan] = useState(() => {
    const selectedPlan = localStorage.getItem('selectedPlan')?.toLowerCase();
    return ['basic', 'pro', 'premium'].includes(selectedPlan) ? selectedPlan : 'pro';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubscribe = async () => {
  if (plan === 'basic') {
    setError('The Basic plan is free and does not require checkout.');
    return;
  }
  const selectedPriceId = priceMap[plan];
  if (!user) {
    setError('Please sign in before starting checkout.');
    return;
  }
  if (!selectedPriceId || !import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    setError('Checkout is not configured for this plan. Please contact support.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const { data } = await api.post('/payment/create-checkout-session', {
      priceId: selectedPriceId,
      userId: user.id,
      plan,
    });

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe is not configured.');
    const { error: redirectError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (redirectError) throw redirectError;
  } catch (err) {
    console.error('Checkout session error:', err);
    setError('Checkout could not be started. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-white dark:bg-[#1E293B]">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#00ADB5]">Subscribe to a Plan</h2>

      <div className="mb-4">
        <label htmlFor="payment-plan" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Select a Plan
        </label>
        <select
          id="payment-plan"
          className="w-full p-2 border rounded bg-white dark:bg-[#334155] dark:text-white"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="basic">Basic - Free</option>
          <option value="pro">Pro - LKR 990/month</option>
          <option value="premium">Premium - LKR 1990/month</option>
        </select>
      </div>

      {error && (
        <div role="alert" className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-2 rounded">
          {error}
        </div>
      )}

      {plan === 'basic' && (
        <p role="status" className="mb-4 text-sm text-muted-foreground">
          The Basic plan is free and does not require checkout.
        </p>
      )}

      <Button
        disabled={loading || plan === 'basic' || !import.meta.env.VITE_STRIPE_PUBLIC_KEY}
        onClick={plan === 'basic' ? () => setError('The Basic plan is free and does not require checkout.') : handleSubscribe}
        className="w-full bg-[#00ADB5] hover:bg-[#00c4cc] text-white text-lg"
      >
        {loading ? 'Redirecting to Stripe...' : `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
      </Button>
    </div>
  );
}
