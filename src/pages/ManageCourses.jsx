import React, { useCallback, useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import InstitutionDashboardLayout from "../layouts/InstitutionLayout";
import { useAuth } from "@/context/AuthContext";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get(`/institutions/${user.institution_id}/courses`);
      if (!Array.isArray(res.data)) throw new Error("Unexpected courses response.");
      setCourses(res.data);
      return true;
    } catch (err) {
      console.error("Error fetching courses:", err);
      setMessage("We couldn't load your courses. Check your connection and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.institution_id]);

  useEffect(() => {
    if (user?.institution_id) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [fetchCourses, user?.institution_id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;
    setIsWorking(true);
    setMessage("");
    try {
      await api.delete(`/courses/${id}`);
      const refreshed = await fetchCourses();
      setMessage(refreshed ? "Course deleted." : "Course deleted, but the course list could not be refreshed.");
    } catch (err) {
      console.error("Error deleting course:", err);
      setMessage("We couldn't delete the course. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title?.trim() ||
      !formData.description?.trim() ||
      !formData.duration?.trim() ||
      !formData.price?.trim()
    ) {
      setMessage("Please fill all fields before submitting.");
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setMessage("Price must be a valid non-negative number.");
      return;
    }

    setIsWorking(true);
    setMessage("");
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData);
      } else {
        await api.post("/courses", {
          ...formData,
          institution_id: user.institution_id,
        });
      }

      // Reset state
      setEditingCourse(null);
      setFormData({ title: "", description: "", duration: "", price: "" });
      setDialogOpen(false);
      const refreshed = await fetchCourses();
      setMessage(refreshed
        ? editingCourse ? "Course updated." : "Course created."
        : "Course saved, but the course list could not be refreshed.");
    } catch (err) {
      console.error("Error submitting course:", err);
      setMessage("We couldn't save the course. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      price: String(course.price ?? ""),
    });
    setDialogOpen(true);
  };

  const openAddNew = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", duration: "", price: "" });
    setDialogOpen(true);
  };

  return (
    <InstitutionDashboardLayout>
      <div className="text-white space-y-6">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Manage Courses</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 px-6 py-2 rounded-xl"
                onClick={openAddNew}
              >
                + Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#3B4758] text-white border border-[#475569] max-w-md">
              <DialogTitle className="mb-4 text-lg font-semibold">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Enter course details to {editingCourse ? "update" : "create"} a course.
              </DialogDescription>
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <Input
                  aria-label="Course title"
                  placeholder="Title"
                  value={formData.title}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Input
                  aria-label="Course description"
                  placeholder="Description"
                  value={formData.description}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Input
                  aria-label="Course duration"
                  placeholder="Duration"
                  value={formData.duration}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
                <Input
                  aria-label="Course price"
                  placeholder="Price"
                  type="number"
                  min="0"
                  value={formData.price}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isWorking}
                    className="bg-[#00ADB5] text-white flex-1"
                  >
                    {isWorking ? "Saving…" : editingCourse ? "Update" : "Create"}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="border border-gray-400 text-white flex-1"
                      onClick={() => {
                        setEditingCourse(null);
                        setFormData({
                          title: "",
                          description: "",
                          duration: "",
                          price: "",
                        });
                        setDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <p role={message.startsWith("We couldn't") ? "alert" : "status"} className="text-sm text-muted-foreground">
            {message}
          </p>
        )}

        {/* Course Cards */}
        {loading ? (
          <p role="status" className="py-8 text-center text-muted-foreground">Loading courses…</p>
        ) : !user?.institution_id ? (
          <p role="alert" className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            Your account is not associated with an institution.
          </p>
        ) : courses.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            No courses are available yet. Add a course to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="space-y-3 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
              >
                <div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {course.title || "Untitled Course"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {course.description?.trim() || "No description provided."}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {course.duration?.trim() || "Flexible"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Price: ₹{course.price ? course.price : "Free"}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    onClick={() => openEdit(course)}
                    className="flex-1"
                    type="button"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(course.id)}
                    disabled={isWorking}
                    variant="destructive"
                    className="flex-1"
                    type="button"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstitutionDashboardLayout>
  );
}
