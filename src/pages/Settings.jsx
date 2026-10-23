import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import DashboardLayout from "@/layouts/DashboardLayout"; // ✅ layout wrapper
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    careerGoal: "",
    learningMode: "Online",
    budget: "",
    duration: "Short-term",
    emailNotifs: true,
    courseAlerts: true,
  });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            name: res.data.name || "",
            email: res.data.email || "",
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          setStatus("We couldn't load your account details.");
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStatus("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus("");
    try {
      await api.put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
      });
      setStatus("Account information updated.");
    } catch (err) {
      console.error("Update failed:", err);
      setStatus("We couldn't update your account information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-6 text-center text-3xl font-bold text-foreground">User Settings</h1>

        <form onSubmit={handleSubmit} className="grid min-w-0 grid-cols-1 gap-6 max-w-4xl mx-auto">
          {/* Account Settings */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="settings-name"
                name="name"
                aria-label="Full name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="bg-background text-foreground"
              />
              <Input
                id="settings-email"
                name="email"
                aria-label="Email address"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-background text-foreground"
              />
              <p className="text-sm text-muted-foreground">
                To change your password, use{" "}
                <Link className="text-primary underline underline-offset-4" to="/forgot-password">
                  password recovery
                </Link>
                . Account deletion is not available from this screen.
              </p>
            </CardContent>
          </Card>

          {/* Notification preferences are not connected to a persistence endpoint yet. */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These preferences apply only in this session and are not saved to your account.
              </p>
              <div className="flex items-center justify-between">
                <label htmlFor="email-notifications">Email Notifications</label>
                <Switch
                  id="email-notifications"
                  aria-label="Email notifications"
                  name="emailNotifs"
                  checked={formData.emailNotifs}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, emailNotifs: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="course-alerts">Course Update Alerts</label>
                <Switch
                  id="course-alerts"
                  aria-label="Course update alerts"
                  name="courseAlerts"
                  checked={formData.courseAlerts}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, courseAlerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Current mode: {resolvedTheme === "dark" ? "Dark" : "Light"}
              </p>
              <ThemeToggle />
            </CardContent>
          </Card>

          {status && (
            <p role={status.startsWith("We couldn't") ? "alert" : "status"} className="text-center text-sm text-muted-foreground">
              {status}
            </p>
          )}
          <Button type="submit" disabled={isSaving || !user?.id}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition shadow-lg flex items-center space-x-2"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
