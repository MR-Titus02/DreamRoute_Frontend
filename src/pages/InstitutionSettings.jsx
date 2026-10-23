import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

export default function InstitutionSettings() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const fetchInstitutionDetails = useCallback(async () => {
    if (!user?.institution_id) return;
    setLoading(true);
    try {
      const res = await api.get(`/institutions/${user.institution_id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching institution details:", err);
      setStatus("We couldn't load institution details. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.institution_id]);

  useEffect(() => {
    fetchInstitutionDetails();
  }, [fetchInstitutionDetails]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setStatus("");
      await api.put(`/institutions/${user.institution_id}`, formData);
      setStatus("Institution profile updated.");
    } catch (err) {
      console.error("Error updating institution:", err);
      setStatus("We couldn't update the institution profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your institution account? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      await api.delete(`/users/${user.id}`);
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Error deleting institution:", err);
      setStatus("Account deletion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstitutionDashboardLayout>
      <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-3xl font-bold mb-4">Institution Settings</h2>

        <div className="space-y-4">
          <label htmlFor="institution-name" className="sr-only">Institution name</label>
          <Input
            id="institution-name"
            placeholder="Institution Name"
            aria-label="Institution name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label htmlFor="institution-description" className="sr-only">Description</label>
          <Input
            id="institution-description"
            placeholder="Description"
            aria-label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <label htmlFor="institution-address" className="sr-only">Address</label>
          <Input
            id="institution-address"
            placeholder="Address"
            aria-label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <label htmlFor="institution-email" className="sr-only">Email</label>
          <Input
            id="institution-email"
            placeholder="Email"
            aria-label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {status && (
          <p role={status.includes("couldn't") || status.includes("failed") ? "alert" : "status"} className="text-sm text-muted-foreground">
            {status}
          </p>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleUpdate}
            className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white flex-1"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </InstitutionDashboardLayout>
  );
}
