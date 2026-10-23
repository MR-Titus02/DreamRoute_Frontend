import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("Your account could not be identified. Please sign in again.");
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/analytics/${user.id}`);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error loading analytics", error);
        setError("We couldn't load your analytics. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, retryCount]);

  if (loading || error || !analytics) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex min-h-64 max-w-2xl items-center justify-center p-6 text-center">
          {loading ? (
            <p role="status" className="text-muted-foreground">Loading your analytics…</p>
          ) : (
            <div>
              <p role={error ? "alert" : "status"} className="mb-4 text-muted-foreground">
                {error || "No analytics are available yet."}
              </p>
              {error && (
                <Button variant="outline" onClick={() => setRetryCount((count) => count + 1)}>
                  Try again
                </Button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  const {
    roadmapCount,
    feedbackCount,
    courseCount,
    lastActive,
    averageRating,
    mostViewedCategory,
    mostEngagedInstitution,
  } = analytics;

  const statCards = [
    {
      label: "🚀 Roadmaps Generated",
      value: roadmapCount || "0",
      color: "text-green-400",
    },
    {
      label: "📝 Feedback Given",
      value: feedbackCount || "0",
      color: "text-green-400",
    },
    {
      label: "🎓 Courses Explored",
      value: courseCount || "0",
      color: "text-indigo-400",
    },
    {
      label: "⏱️ Last Active",
      value: lastActive
        ? new Date(lastActive).toLocaleString()
        : "No activity yet",
      color: "text-gray-400 text-sm",
    },
    {
      label: "⭐ Avg. Feedback Rating",
      value: averageRating || "N/A",
      color: "text-yellow-400",
    },
    {
      label: "🔍 Top Interest Area",
      value: mostViewedCategory || "N/A",
      color: "text-blue-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-8 md:px-16">
        <h1 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
          Your Career Analytics
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-8">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:shadow-md"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {card.label}
                </h2>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlight most engaged institution if available */}
        {mostEngagedInstitution && (
          <Card           className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Most Engaged Institution
              </h2>
              <p className="text-2xl font-bold text-purple-400">
                {mostEngagedInstitution}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
