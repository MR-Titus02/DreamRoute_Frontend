import React, { useCallback, useEffect, useState } from "react";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(5); // Default to 5
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { token, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoadingCounts(true);
    setLoadError("");
    setUsers([]);
    setCourses([]);
    setLogs([]);
    try {
      const [userRes, courseRes, logRes] = await Promise.all([
        api.get("/users/"),
        api.get("/courses/"),
        api.get("/login-logs/"),
      ]);
      if (
        !Array.isArray(userRes.data) ||
        !Array.isArray(courseRes.data) ||
        !Array.isArray(logRes.data)
      ) {
        throw new Error("Unexpected admin dashboard response.");
      }
      setUsers(userRes.data || []);
      setCourses(courseRes.data || []);
      setLogs(logRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoadError("We couldn't load admin dashboard data. Check your connection and try again.");
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && token) fetchData();
  }, [fetchData, loading, token]);

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.premium).length;
  const totalCourses = courses.length;
  const totalInstitutions = users.filter((u) => u.role === "institution").length;

  // Apply role filtering
  const filteredLogs = roleFilter === "all"
    ? logs
    : logs.filter((log) => log.role === roleFilter);

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * limit, currentPage * limit);
  const totalPages = Math.ceil(filteredLogs.length / limit);

  return (
    <AdminLayout>
      <h1 className="mb-6 text-3xl font-bold text-foreground">Admin Dashboard</h1>

      {loadError && (
        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-lg border border-error/30 bg-destructive/10 p-4 text-error sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          <Button variant="outline" onClick={fetchData}>Try again</Button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-foreground">
            {loadingCounts || loadError ? "—" : totalUsers}
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Premium Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-foreground">
            {loadingCounts || loadError ? "—" : premiumUsers}
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-foreground">
            {loadingCounts || loadError ? "—" : totalCourses}
          </CardContent>
        </Card>
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Institutions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-foreground">
            {loadingCounts || loadError ? "—" : totalInstitutions}
          </CardContent>
        </Card>
      </div>

      {/* Login History Section */}
      <Card className="mb-6 border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Login History</CardTitle>

          <div className="flex gap-4 flex-wrap">
            {/* Filter by Role */}
            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="institution">Institutions</SelectItem>
                <SelectItem value="student">Students</SelectItem>
              </SelectContent>
            </Select>

            {/* Limit Selector */}
            <Select value={String(limit)} onValueChange={(value) => {
              setLimit(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    Last {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => (
                  <tr key={log.id ?? `${log.email}-${log.created_at}-${idx}`} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-4 py-2">{log.name}</td>
                    <td className="px-4 py-2">{log.email}</td>
                    <td className="px-4 py-2 capitalize text-primary">{log.role}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          log.status === "success"
                            ? "text-success font-medium"
                            : "text-error font-medium"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : loadError ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">
                    Login history is unavailable until the dashboard data loads.
                  </td>
                </tr>
              ) : loadingCounts ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground" role="status">
                    Loading login history…
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">
                    No login history is available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredLogs.length > limit && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
