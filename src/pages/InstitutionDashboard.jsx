import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout"; 

export default function InstitutionDashboard() {
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { user } = useAuth();
  const institutionId = user?.institution_id;

  const fetchCourseStats = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    if (!institutionId) {
      setLoadError("Your account is not linked to an institution. Contact an administrator for help.");
      setLoading(false);
      return;
    }
      try {
        const res = await api.get(`/institutions/${institutionId}/courses`);
        if (!Array.isArray(res.data)) {
          throw new Error("Unexpected institution courses response.");
        }
        setCourseCount(res.data.length);
      } catch (err) {
        console.error("Error fetching courses for institution:", err);
        setLoadError("We couldn't load your institution's courses. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
  }, [institutionId]);

  useEffect(() => {
    fetchCourseStats();
  }, [fetchCourseStats]);

  return (
    <InstitutionDashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Institution dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your institution&apos;s course catalogue.
          </p>
        </div>
        <Button asChild>
          <Link to="/institution/courses">Manage courses</Link>
        </Button>
      </div>

      {loadError && (
        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-lg border border-error/30 bg-destructive/10 p-4 text-error sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          {institutionId && (
            <Button variant="outline" onClick={fetchCourseStats}>Try again</Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Total courses</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-foreground">
            {loading || loadError ? "—" : courseCount}
          </CardContent>
        </Card>
      </div>
    </InstitutionDashboardLayout>
  );
}
