import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const limit = 6;
  const totalPages = Math.ceil(filteredCourses.length / limit);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const fetchCoursesAndInstitutions = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [coursesRes, institutionsRes] = await Promise.all([
        api.get("/courses"),
        api.get("/institutions"),
      ]);

      const coursesData = coursesRes.data;
      const institutionsData = institutionsRes.data;

      if (!Array.isArray(coursesData) || !Array.isArray(institutionsData)) {
        throw new Error("Unexpected courses response.");
      }

      const updatedCourses = coursesData.map((course) => {
        const inst = institutionsData.find(
          (i) => String(i.id) === String(course.institution_id)
        );
        return {
          ...course,
          institution: inst || null,
        };
      });

      setInstitutions(institutionsData);
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
    } catch (err) {
      console.error("Error fetching courses and institutions:", err);
      setLoadError("We couldn't load courses. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndInstitutions();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = courses.filter((course) => {
      const matchesSearch =
        String(course.title || "").toLowerCase().includes(lowerSearch) ||
        String(course.description || "").toLowerCase().includes(lowerSearch);

      const matchesInstitution = selectedInstitution
        ? String(course.institution_id) === selectedInstitution
        : true;

      const matchesDuration =
        (!minDuration || parseFloat(course.duration) >= parseFloat(minDuration)) &&
        (!maxDuration || parseFloat(course.duration) <= parseFloat(maxDuration));

      const matchesPrice =
        (!minPrice || parseFloat(course.price) >= parseFloat(minPrice)) &&
        (!maxPrice || parseFloat(course.price) <= parseFloat(maxPrice));

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesDuration &&
        matchesPrice
      );
    });

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedInstitution,
    minDuration,
    maxDuration,
    maxPrice,
    minPrice,
    courses,
  ]);

  // Scroll to grid on page change
  useEffect(() => {
    const gridTop = document.getElementById("course-grid")?.offsetTop || 0;
    window.scrollTo({ top: gridTop - 100, behavior: "smooth" });
  }, [currentPage]);

  const closeModal = () => setSelectedCourse(null);
  
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold text-foreground">
            Explore available courses
          </h1>
  
          <div className="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground sm:grid-cols-2 lg:grid-cols-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="course-search" className="mb-1 block text-sm font-medium">Search</label>
              <Input
                id="course-search"
                type="text"
                placeholder="Course title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground"
              />
            </div>
  
            <div className="w-full sm:w-auto">
              <label htmlFor="course-institution" className="mb-1 block text-sm font-medium">Institution</label>
              <select
                id="course-institution"
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground"
              >
                <option value="">All Institutions</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="w-full sm:w-auto">
              <span className="mb-1 block text-sm font-medium">Duration (weeks)</span>
              <div className="flex gap-2">
                <Input
                  aria-label="Minimum duration in weeks"
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  className="w-full bg-background text-foreground"
                />
                <Input
                  aria-label="Maximum duration in weeks"
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full bg-background text-foreground"
                />
              </div>
            </div>
  
            <div className="w-full sm:w-auto">
              <span className="mb-1 block text-sm font-medium">Price (₹)</span>
              <div className="flex gap-2">
              <Input
                aria-label="Minimum price in rupees"
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-background text-foreground"
              />
              <Input
                aria-label="Maximum price in rupees"
                type="number"
                min="0"
                placeholder="Any price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-background text-foreground"
              />
              </div>
            </div>
          </div>
  
          <div
            id="course-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedCourses.map((course) => (
              <Card
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedCourse(course);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${course.title || "course"}`}
                className="flex min-h-[230px] cursor-pointer flex-col justify-between rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    {course.title || "Untitled course"}
                  </h2>
                  <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                    {course.description || "No description provided."}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {course.duration ? `${course.duration} weeks` : "Flexible duration"}
                    </span>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                      {Number(course.price) > 0 ? `₹${course.price}` : "Free"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.institution?.name || "Institution Unknown"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
  
          {loading && (
            <div role="status" className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              Loading courses…
            </div>
          )}
          {loadError && (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-error/30 bg-destructive/10 p-6 text-center text-error">
              <p>{loadError}</p>
              <Button variant="outline" onClick={fetchCoursesAndInstitutions}>Try again</Button>
            </div>
          )}
          {!loading && !loadError && filteredCourses.length === 0 && (
            <div className="mt-8 rounded-lg border border-border bg-card py-8 text-center">
              <p className="mb-2 text-lg text-foreground">
                {courses.length === 0 ? "No courses are available yet." : "No courses match your filters."}
              </p>
              {courses.length > 0 && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedInstitution("");
                  setMinDuration("");
                  setMaxDuration("");
                  setMaxPrice("");
                  setMinPrice("");
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
              )}
            </div>
          )}
  
          {/* Pagination - Enhanced */}
          {filteredCourses.length > limit && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, filteredCourses.length)} of {filteredCourses.length} courses
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className="min-w-[40px]"
                        aria-current={currentPage === pageNum ? "page" : undefined}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
  
          {/* Course Details Modal - Enhanced */}
          <Dialog
            open={Boolean(selectedCourse)}
            onOpenChange={(open) => {
              if (!open) closeModal();
            }}
          >
            {selectedCourse && (
              <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto border-border bg-card text-card-foreground">
                <div className="space-y-5">
                  <DialogTitle className="pr-8 text-2xl font-bold text-foreground">
                    {selectedCourse.title || "Untitled course"}
                  </DialogTitle>
  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {selectedCourse.duration ? `${selectedCourse.duration} weeks` : "Flexible duration"}
                    </span>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                      {Number(selectedCourse.price) > 0 ? `₹${selectedCourse.price}` : "Free"}
                    </span>
                  </div>
  
                  <DialogDescription className="text-muted-foreground">
                    {selectedCourse.description || "No description provided."}
                  </DialogDescription>
  
                  {selectedCourse.institution && (
                    <div className="mt-6 border-t border-border pt-4">
                      <h3 className="mb-3 text-lg font-semibold text-primary">Offered by</h3>
                      <div className="rounded-lg bg-muted p-4">
                        <h4 className="font-medium text-foreground">{selectedCourse.institution.name || "Institution"}</h4>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {selectedCourse.institution.address || "Address not provided"}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {selectedCourse.institution.email ? (
                              <a href={`mailto:${selectedCourse.institution.email}`} className="underline underline-offset-2 hover:text-foreground">
                                {selectedCourse.institution.email}
                              </a>
                            ) : "Email not provided"}
                          </p>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {selectedCourse.institution.description}
                        </p>
                      </div>
                    </div>
                  )}
  
                  <div className="mt-8 flex justify-end gap-3">
                    {selectedCourse.institution?.email && (
                      <Button asChild>
                        <a href={`mailto:${selectedCourse.institution.email}?subject=${encodeURIComponent(`Course enquiry: ${selectedCourse.title || "course"}`)}`}>
                          Contact institution
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
            </DialogContent>
          )}
        </Dialog>
        </div>
      </DashboardLayout>
    );
  }