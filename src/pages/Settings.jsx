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
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
      });
      alert("Account info updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong while updating.");
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="bg-background text-foreground"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-background text-foreground"
              />
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button variant="secondary" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition shadow-lg flex items-center space-x-2"
              >
                Change Password
              </Button>
              <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences (only frontend for now) */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Email Notifications</label>
                <Switch
                  name="emailNotifs"
                  checked={formData.emailNotifs}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, emailNotifs: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Course Update Alerts</label>
                <Switch
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

          <Button type="submit" 
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition shadow-lg flex items-center space-x-2"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
