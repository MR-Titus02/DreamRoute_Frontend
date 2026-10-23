import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get("/users");
      if (!Array.isArray(res.data)) throw new Error("Unexpected users response.");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      setMessage("We couldn't load users. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    setIsWorking(true);
    setMessage("");
    try {
      await api.put(`/admin/change/${userId}`, { role: newRole });
      await fetchUsers();
      setMessage("User role updated.");
    } catch (error) {
      console.error("Failed to update user role:", error);
      setMessage("We couldn't update that user's role. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  async function confirmDelete() {
    if (deleteTarget === null) return;
    setIsWorking(true);
    setMessage("");
    try {
      await api.delete(`/users/${deleteTarget}`);
      setDeleteTarget(null);
      await fetchUsers();
      setMessage("User deleted.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      setMessage("We couldn't delete that user. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  const filteredUsers = users
    .filter(
      (u) =>
        String(u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "role"
        ? a.role.localeCompare(b.role)
        : String(a.name || "").localeCompare(String(b.name || ""))
    );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const RoleBadge = ({ role }) => {
    const { color, label } =
      role === "admin"
        ? { color: "bg-purple-600", label: "Admin" }
        : role === "institution"
        ? { color: "bg-indigo-600", label: "Institution" }
        : { color: "bg-green-600", label: "Student" };
  
    return (
      <span
        className={`inline-block w-[90px] text-center text-xs font-semibold px-2 py-1 rounded ${color} text-white`}
      >
        {label}
      </span>
    );
  };
  

  return (
    <AdminLayout>
      <h2 className="mb-4 text-2xl font-bold text-foreground">User Management</h2>
      {message && (
        <p role={message.startsWith("We couldn't") ? "alert" : "status"} className="mb-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Input
          placeholder="Search users..."
          className="bg-[#3B4758] text-white sm:w-1/2"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] bg-[#1E293B] text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#3B4758] text-white">
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="role">Sort by Role</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-border bg-card text-card-foreground">
  <CardHeader>
    <CardTitle>All Users</CardTitle>
  </CardHeader>
  <CardContent>
    {loading ? (
      <p role="status" className="py-6 text-center text-muted-foreground">Loading users…</p>
    ) : paginatedUsers.length === 0 ? (
      <p className="py-6 text-center text-muted-foreground">No users match this search.</p>
    ) : <ul>
      {paginatedUsers.map((user) => (
        <li
          key={user.id}
          className="flex flex-col justify-between gap-3 border-b border-border py-3 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-medium text-foreground">{user.name || "Unnamed user"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <Select
              value={user.role}
              onValueChange={(val) => handleRoleChange(user.id, val)}
              disabled={isWorking}
            >
              <SelectTrigger className="w-36 bg-[#1E293B] text-white">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#3B4758] text-white">
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={() => setDeleteTarget(user.id)}
              disabled={isWorking}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-700 hover:to-red-900 transition duration-200"
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>}

    {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-gray-200">
        Page {Math.min(currentPage, totalPages || 1)} of {totalPages || 1}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-white border-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-white border-gray-400"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  </CardContent>
</Card>


      {/* Delete Confirmation Modal */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="bg-[#1E293B] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This permanently removes the selected user account.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={isWorking}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isWorking}>
              {isWorking ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
