import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5; // fixed value, no need state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    institution_id: null, // store as number or null
    status: "approved",
  });

  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchCourses();
    if (user?.role === "admin") {
      fetchInstitutions();
    }
  }, [user]);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await api.get("/courses/");
      if (!Array.isArray(res.data)) throw new Error("Unexpected courses response.");
      setCourses(res.data);
      return true;
    } catch (err) {
      console.error("Error fetching courses:", err);
      setMessage("We couldn't load courses. Check your connection and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function fetchInstitutions() {
    try {
      const res = await api.get("/institutions/");
      setInstitutions(res.data || []);
    } catch (err) {
      console.error("Error fetching institutions:", err);
      setMessage("We couldn't load institutions. Course creation is unavailable.");
    }
  }

  async function handleCourseAction(courseId, action) {
    setIsWorking(true);
    setMessage("");
    try {
      if (action === "approve" || action === "reject") {
        const newStatus = action === "approve" ? "approved" : "rejected";
        await api.put(`/courses/${courseId}/status`, { status: newStatus });
      } else if (action === "delete") {
        await api.delete(`/courses/${courseId}`);
        setConfirmDeleteId(null);
      }
      const refreshed = await fetchCourses();
      setMessage(refreshed
        ? action === "delete" ? "Course deleted." : `Course ${action === "approve" ? "approved" : "rejected"}.`
        : "The course was updated, but the list could not be refreshed.");
    } catch (err) {
      console.error(`Error during ${action} course:`, err?.response?.data || err.message);
      setMessage(`We couldn't ${action} this course. Please try again.`);
    } finally {
      setIsWorking(false);
    }
  }

  async function createCourse() {
    const { title, description, duration, price, institution_id, status } = newCourse;

    if (!title.trim() || !description.trim() || !institution_id) {
      setMessage("Title, description, and institution are required.");
      return;
    }

    setIsWorking(true);
    setMessage("");
    try {
      await api.post("/courses", {
        title,
        description,
        duration,
        price,
        institution_id,
        status,
      });

      setNewCourse({
        title: "",
        description: "",
        duration: "",
        price: "",
        institution_id: null,
        status: "approved",
      });

      const refreshed = await fetchCourses();
      setMessage(refreshed
        ? "Course created."
        : "Course created, but the course list could not be refreshed.");
    } catch (err) {
      console.error("Error creating course:", err);
      setMessage("We couldn't create the course. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchStatus = statusFilter === "all" || course.status === statusFilter;
      const matchTitle = String(course.title || "").toLowerCase().includes(titleFilter.toLowerCase());
      return matchStatus && matchTitle;
    })
    .sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Get institution name safely
  const getInstitutionName = (institutionId) => {
    const inst = institutions.find((i) => i.id === Number(institutionId));
    return inst ? inst.name : "Unknown";
  };

  return (
    <AdminLayout>
      <h2 className="mb-6 text-3xl font-bold text-foreground">Course Management</h2>
      {message && (
        <p role={message.startsWith("We couldn't") ? "alert" : "status"} className="mb-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}

      {user?.role === "admin" && (
        <Card className="bg-[#3B4758] p-6 mb-6 text-white">
          <CardTitle className="mb-4">Create New Course</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Title *"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Input
              placeholder="Duration (e.g., 8 weeks)"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Input
              placeholder="Price (e.g., 199.99)"
              type="number"
              value={newCourse.price}
              onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Select
              value={newCourse.institution_id !== null ? String(newCourse.institution_id) : ""}
              onValueChange={(val) =>
                setNewCourse({ ...newCourse, institution_id: Number(val) })
              }
            >
              <SelectTrigger className="bg-[#1E293B] text-white border-gray-500">
                {newCourse.institution_id
                  ? getInstitutionName(newCourse.institution_id)
                  : "Select Institution *"}
              </SelectTrigger>
              <SelectContent className="bg-[#3B4758] text-white">
                {institutions.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id.toString()} className="text-white">
                    {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description *"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Select
              onValueChange={(val) => setNewCourse({ ...newCourse, status: val })}
              value={newCourse.status}
            >
              <SelectTrigger className="bg-[#1E293B] text-white border-gray-500">
                {newCourse.status.charAt(0).toUpperCase() + newCourse.status.slice(1)}
              </SelectTrigger>
              <SelectContent className="bg-[#3B4758] text-white">
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className={`mt-4 w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] hover:from-[#00C4CC] hover:to-[#00ADB5] text-white font-bold py-1 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00ADB5]/30 focus:outline-none focus:ring-4 focus:ring-[#00ADB5]/50 font-inter
            ${
              !newCourse.title.trim() ||
              !newCourse.description.trim() ||
              !newCourse.institution_id
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={createCourse}
            disabled={isWorking ||
              !newCourse.title.trim() ||
              !newCourse.description.trim() ||
              !newCourse.institution_id}
          >
            {isWorking ? "Creating…" : "Create Course"}
          </Button>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title..."
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-[#1E293B] text-white border-gray-500"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-48 bg-[#1E293B] text-white border-gray-500">
            {statusFilter === "all" ? "All Statuses" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </SelectTrigger>
          <SelectContent className="bg-[#3B4758] text-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setSortBy} defaultValue="default">
          <SelectTrigger className="w-48 bg-[#1E293B] text-white border-gray-500">
            Sort by
          </SelectTrigger>
          <SelectContent className="bg-[#3B4758] text-white">
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Table */}
      <Card className="bg-[#3B4758] shadow-lg text-white">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p role="status" className="py-6 text-center text-muted-foreground">Loading courses…</p>
          ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="text-gray-300">
              <tr>
                <th className="py-2">Title</th>
                <th>Institution</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No courses found.
                  </td>
                </tr>
              )}
              {currentCourses.map((course) => (
                <tr key={course.id} className="border-t border-gray-600">
                  <td className="py-2 text-white">{course.title}</td>
                  <td>
                    <Badge className="bg-blue-600 text-white">
                      {getInstitutionName(course.institution_id)}
                    </Badge>
                  </td>
                  <td className="text-white">{course.status}</td>
                  <td className="space-x-2 text-center">
                    {course.status === "pending" && user?.role === "admin" && (
                      <>
                            <Button onClick={() => handleCourseAction(course.id, "approve")} disabled={isWorking}>Approve</Button>
                            <Button onClick={() => handleCourseAction(course.id, "reject")} disabled={isWorking}>Reject</Button>
                      </>
                    )}
                    <Dialog open={confirmDeleteId === course.id} onOpenChange={() => setConfirmDeleteId(null)}>
                      <DialogTrigger asChild>
                        <Button
                         className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-700 hover:to-red-900 transition duration-200"
                         onClick={() => setConfirmDeleteId(course.id)}
                         disabled={isWorking}>
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1E293B] text-white border border-gray-500">
                        <DialogTitle className="text-white">Confirm Delete</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Are you sure you want to delete the course "{course.title}"?
                        </DialogDescription>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setConfirmDeleteId(null)} disabled={isWorking}>Cancel</Button>
                          <Button variant="destructive" onClick={() => handleCourseAction(course.id, "delete")} disabled={isWorking}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-gray-400"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>
            <span className="text-gray-200">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-white border-gray-400"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
