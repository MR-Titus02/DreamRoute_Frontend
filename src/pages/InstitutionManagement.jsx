import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/layouts/AdminLayout";

export default function InstitutionManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newInstitutionName, setNewInstitutionName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [userEmails, setUserEmails] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInstitutions();
    fetchUserEmails();
    fetchInstitutionRequests();
  }, []);

  async function fetchInstitutions() {
    try {
      const res = await api.get("/institutions/");
      if (!Array.isArray(res.data)) throw new Error("Unexpected institutions response.");
      setInstitutions(res.data);
      return true;
    } catch (err) {
      console.error("Error fetching institutions:", err);
      setMessage("We couldn't load institutions. Check your connection and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserEmails() {
    try {
      const res = await api.get("/users");
      if (!Array.isArray(res.data)) throw new Error("Unexpected users response.");
      const filtered = res.data.filter((user) => user.role !== "institution");
      setUserEmails(filtered);
    } catch (err) {
      console.error("Error fetching user emails:", err);
      setMessage("We couldn't load user accounts for institution assignment.");
    }
  }

  async function fetchInstitutionCourses(id) {
    try {
      const res = await api.get(`/institutions/${id}/courses`);
      if (!Array.isArray(res.data)) throw new Error("Unexpected courses response.");
      setCourses(res.data);
      setSelectedInstitutionId(id);
      return true;
    } catch (err) {
      console.error("Error fetching institution courses:", err);
      setMessage("We couldn't load courses for this institution.");
      return false;
    }
  }

  async function handleDeleteInstitution(id) {
    if (!window.confirm("Delete this institution? This action cannot be undone.")) return;
    setIsWorking(true);
    setMessage("");
    try {
      await api.delete(`/institutions/${id}`);
      const refreshed = await fetchInstitutions();
      setMessage(refreshed ? "Institution deleted." : "Institution deleted, but the list could not be refreshed.");
    } catch (err) {
      console.error("Error deleting institution:", err);
      setMessage("We couldn't delete this institution. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleAddInstitution() {
    if (!newInstitutionName.trim() || !selectedUserEmail) {
      setMessage("Choose a user and enter an institution name.");
      return;
    }
    setIsWorking(true);
    setMessage("");
    try {
      await api.post("/institutions/new-ins", {
        name: newInstitutionName.trim(),
        email: selectedUserEmail,
      });
      setNewInstitutionName("");
      setSelectedUserEmail("");
      const refreshed = await fetchInstitutions();
      setMessage(refreshed ? "Institution added." : "Institution added, but the list could not be refreshed.");
    } catch (err) {
      console.error("Error adding institution:", err);
      setMessage("We couldn't add the institution. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  async function fetchInstitutionRequests() {
    try {
      const res = await api.get("/admin/");
      if (!Array.isArray(res.data)) throw new Error("Unexpected institution requests response.");
      setRequests(res.data);
      return true;
    } catch (err) {
      console.error("Error fetching institution requests:", err);
      setMessage("We couldn't load institution requests.");
      return false;
    }
  }

  async function handleApproveRequest(id) {
    setIsWorking(true);
    setMessage("");
    try {
      await api.post(`/admin/${id}/approve`);
      const [requestsLoaded, institutionsLoaded] = await Promise.all([
        fetchInstitutionRequests(),
        fetchInstitutions(),
      ]);
      setMessage(requestsLoaded && institutionsLoaded
        ? "Institution request approved."
        : "Institution request approved, but some lists could not be refreshed.");
    } catch (err) {
      console.error("Error approving request:", err);
      setMessage("We couldn't approve this institution request.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleRejectRequest(id) {
    setIsWorking(true);
    setMessage("");
    try {
      await api.post(`/admin/${id}/reject`);
      const refreshed = await fetchInstitutionRequests();
      setMessage(refreshed
        ? "Institution request rejected."
        : "Institution request rejected, but the request list could not be refreshed.");
    } catch (err) {
      console.error("Error rejecting request:", err);
      setMessage("We couldn't reject this institution request.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleCourseStatus(courseId, status) {
    setIsWorking(true);
    setMessage("");
    try {
      await api.put(`/courses/${courseId}/status`, { status });
      const refreshed = selectedInstitutionId
        ? await fetchInstitutionCourses(selectedInstitutionId)
        : true;
      setMessage(refreshed
        ? `Course ${status}.`
        : `Course ${status}, but the course list could not be refreshed.`);
    } catch (err) {
      console.error("Error updating course status:", err);
      setMessage("We couldn't update the course status.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDeleteCourse(courseId) {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;
    setIsWorking(true);
    setMessage("");
    try {
      await api.delete(`/courses/${courseId}`);
      const refreshed = selectedInstitutionId
        ? await fetchInstitutionCourses(selectedInstitutionId)
        : true;
      setMessage(refreshed
        ? "Course deleted."
        : "Course deleted, but the course list could not be refreshed.");
    } catch (err) {
      console.error("Error deleting course:", err);
      setMessage("We couldn't delete the course.");
    } finally {
      setIsWorking(false);
    }
  }

  const filteredInstitutions = institutions.filter((i) =>
    (i.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="mb-6 text-3xl font-bold text-foreground">Institution Management</h1>
      {message && (
        <p role={message.startsWith("We couldn't") ? "alert" : "status"} className="mb-4 text-sm text-muted-foreground">
          {message}
        </p>
      )}

      {/* Institution Management UI */}
      <Card className="mb-6 bg-[#3B4758] text-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-white">
            <span>Institutions</span>
            <Input
              placeholder="Search institution..."
              className="w-64 bg-[#1E293B] text-white border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Select onValueChange={setSelectedUserEmail}>
              <SelectTrigger className="bg-[#1E293B] text-white border-gray-500 w-64">
                <SelectValue placeholder="Select User Email" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] text-white border-gray-500">
                {userEmails.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.email}
                    className="text-white hover:bg-[#334155] focus:bg-[#334155] cursor-pointer"
                  >
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Institution Name"
              value={newInstitutionName}
              onChange={(e) => setNewInstitutionName(e.target.value)}
              className="bg-[#1E293B] text-white border-gray-500"
            />
            <Button onClick={handleAddInstitution} disabled={isWorking}>Add Institution</Button>
          </div>
          {loading ? (
            <p role="status" className="py-5 text-muted-foreground">Loading institutions…</p>
          ) : filteredInstitutions.length === 0 ? (
            <p className="py-5 text-muted-foreground">No institutions found.</p>
          ) : <ul className="space-y-3">
            {filteredInstitutions.map((institution) => (
              <li
                key={institution.id}
                className="flex justify-between border-b border-gray-600 pb-2"
              >
                <div>
                  <p className="font-semibold text-white">{institution.name}</p>
                  <p className="text-sm text-gray-200">{institution.email}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchInstitutionCourses(institution.id)}
                    disabled={isWorking}
                  >
                    View Courses
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteInstitution(institution.id)}
                    disabled={isWorking}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:from-red-700 hover:to-red-900 transition duration-200"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>}
        </CardContent>
      </Card>

      {/* Courses by Selected Institution */}
      {selectedInstitutionId && (
        <Card className="bg-[#3B4758] text-white">
          <CardHeader>
            <CardTitle className="text-white">Courses by Institution</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-gray-300">No courses found for this institution.</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="text-gray-200">
                    <th className="py-2">Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t border-gray-600">
                      <td className="py-2 font-medium text-white">{course.title}</td>
                      <td className="text-sm text-gray-200">{course.description}</td>
                      <td className="text-white">{course.status}</td>
                      <td className="space-x-2">
                        <Button
                          onClick={() => handleCourseStatus(course.id, "approved")}
                          disabled={isWorking}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleCourseStatus(course.id, "rejected")}
                          disabled={isWorking}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={isWorking}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Institution Requests */}
      <Card className="mt-6 bg-[#3B4758] text-white">
        <CardHeader>
          <CardTitle className="text-white">Pending Institution Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="text-gray-300">No pending requests.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-gray-200 border-b border-gray-600">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .filter((r) => r.status === "pending")
                  .map((req) => (
                    <tr key={req.id} className="border-t border-gray-600">
                      <td className="py-2 text-white">{req.name}</td>
                      <td className="text-sm text-gray-200">{req.email}</td>
                      <td className="text-sm text-gray-300">{req.description}</td>
                      <td className="text-sm text-gray-300">{req.address}</td>
                      <td className="space-x-2">
                        <Button
                          onClick={() => handleApproveRequest(req.id)}
                          disabled={isWorking}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectRequest(req.id)}
                          disabled={isWorking}
                          className="px-4 py-1"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
