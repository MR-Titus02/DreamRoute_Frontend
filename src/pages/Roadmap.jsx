import React, { useCallback, useEffect, useState } from "react";
import { fetchRoadmap, fetchProgress, updateProgress } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import PlansModal from "@/components/PlansModal"; // <- Make sure this path is correct
import { Lock } from "lucide-react";

const STATUS_COLORS = {
  not_started: { bg: "var(--card)", border: "var(--border)", text: "var(--foreground)" },
  ongoing: { bg: "var(--accent)", border: "var(--primary)", text: "var(--accent-foreground)" },
  done: { bg: "var(--success)", border: "var(--success)", text: "var(--background)" },
};

export default function Roadmap() {
  const { user } = useAuth();
  const isPremium = user?.is_premium;
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressError, setProgressError] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [savingSteps, setSavingSteps] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});
  const [showPlansModal, setShowPlansModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  let storedUserId;
  try {
    storedUserId = storedUser ? JSON.parse(storedUser)?.id : undefined;
  } catch (parseError) {
    console.error("Failed to read stored user:", parseError);
  }
  const userId = user?.id || storedUserId;

  const loadRoadmap = useCallback(async () => {
    if (!userId) {
      setError("Your account could not be identified. Please sign in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setRoadmap([]);
    setCourses([]);
    setInstitutions([]);
    setCareer("");

    try {
      const { career, roadmap = [], courses = [], institutions = [] } = await fetchRoadmap(userId);
      if (!Array.isArray(roadmap) || !Array.isArray(courses) || !Array.isArray(institutions)) {
        throw new Error("Unexpected roadmap response.");
      }

      const flatSteps = roadmap.length > 0 && Array.isArray(roadmap[0]?.steps)
        ? roadmap.flatMap((section) =>
            section.steps.map((step) => ({ ...step, section: section.section }))
          )
        : roadmap;

      const progressResponse = await fetchProgress(userId);
      const progressArray = progressResponse?.data || progressResponse;
      if (!Array.isArray(progressArray)) {
        throw new Error("Unexpected progress response.");
      }
      const progressMap = {};
      progressArray.forEach(({ step_id, status }) => {
        progressMap[String(step_id)] = status;
      });

      setCareer(career);
      setRoadmap(flatSteps);
      setCourses(courses);
      setInstitutions(institutions);
      setStatusMap(progressMap);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      setError(err.response?.data?.error || "We couldn't load your roadmap. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRoadmap();
  }, [loadRoadmap]);

  useEffect(() => {
    if (!loading && roadmap.length > 0) {
      const params = new URLSearchParams(location.search);
      const stepId = params.get("step");

      if (stepId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(`step-${stepId}`);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            element.classList.add("timeline-glow");

            setTimeout(() => {
              element.classList.remove("timeline-glow");
            }, 2000);
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, roadmap, location.search]);

  const handleStatusChange = async (stepId, newStatus) => {
    const previousStatus = statusMap[stepId] || "not_started";
    setProgressError("");
    setStatusMap((prev) => ({ ...prev, [stepId]: newStatus }));
    setSavingSteps((prev) => ({ ...prev, [stepId]: true }));
    try {
      await updateProgress({ userId, stepId, status: newStatus });
    } catch (err) {
      console.error("Failed to update progress:", err);
      setStatusMap((prev) => ({ ...prev, [stepId]: previousStatus }));
      setProgressError("Your progress could not be saved. Please try changing the status again.");
    } finally {
      setSavingSteps((prev) => ({ ...prev, [stepId]: false }));
    }
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen max-w-full bg-background p-4 text-foreground sm:p-6">
        <h1 className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl">
          Career recommendation: <span className="text-primary">{career || "Not available"}</span>
        </h1>

        {/* Regenerate Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => {
              isPremium ? loadRoadmap() : setShowPlansModal(true);
            }}
            className="rounded-lg"
            disabled={loading}
          >
            <span>Regenerate roadmap</span>
            {!isPremium && <Lock size={16} className="ml-2 text-yellow-400" />}
          </Button>
        </div>

        {loading && (
          <div role="status" className="flex h-[300px] flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
            <p className="text-lg font-medium">Loading your roadmap…</p>
          </div>
        )}

        {error && (
          <div role="alert" className="mx-auto mb-6 max-w-2xl rounded-lg border border-error/30 bg-destructive/10 p-4 text-center text-error">
            <p className="mb-3">{error}</p>
            <Button
              variant="outline"
              onClick={loadRoadmap}
            >
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && roadmap.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">Your roadmap is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Complete your career profile to generate a roadmap tailored to your goals.
            </p>
            <Button className="mt-5" onClick={() => navigate("/userdetails")}>
              Complete profile
            </Button>
          </div>
        )}

        {!loading && !error && roadmap.length > 0 && (
          <>
          {progressError && (
            <div role="alert" className="mx-auto mb-5 max-w-5xl rounded-md border border-error/30 bg-destructive/10 p-3 text-sm text-error">
              {progressError}
            </div>
          )}
          <VerticalTimeline lineColor="var(--border)" className="max-w-5xl mx-auto">
            {roadmap.map((step, index) => {
              const status = statusMap[step.id] || "not_started";
              const expanded = !!expandedSteps[step.id];
              const colors = STATUS_COLORS[status] || STATUS_COLORS["not_started"];

              const course = courses.find(
                (c) => c.id === step.courseId || c.id === step.course_id
              );
              const institution = course
                ? institutions.find((i) => i.id === course.institution_id)
                : null;

              return (
                <VerticalTimelineElement
                  key={step.id}
                  id={`step-${step.id}`}
                  date={step.section || ""}
                  iconStyle={{
                    background: colors.border,
                    color: "var(--primary-foreground)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    userSelect: "none",
                  }}
                  icon={
                    step.milestone ? (
                      <span role="img" aria-label="milestone">🏁</span>
                    ) : (
                      index + 1
                    )
                  }
                  contentStyle={{
                    background: colors.bg,
                    color: colors.text,
                    borderTop: `3px solid ${colors.border}`,
                    transition: "all 0.3s ease",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                  contentArrowStyle={{ borderRight: `7px solid ${colors.bg}` }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{step.label}</h3>
                    <button
                      onClick={(e) => toggleExpand(step.id, e)}
                      className="rounded px-2 text-primary font-bold text-xl focus-visible:outline-none"
                      aria-label={expanded ? "Collapse details" : "Expand details"}
                      title={expanded ? "Collapse details" : "Expand details"}
                    >
                      {expanded ? "−" : "+"}
                    </button>
                  </div>

                  <h4 className="mb-2 text-muted-foreground">
                    Estimated Time: {step.estimatedTime || "N/A"}
                  </h4>
                  <p className="whitespace-pre-line text-muted-foreground">{step.description}</p>

                  {expanded && step.details && Array.isArray(step.details) && (
                    <ul className="ml-6 mt-3 space-y-2 border-l-2 border-primary pl-4 text-sm">
                      {step.details.map((sub) => (
                        <li
                          key={sub.id}
                          className="rounded bg-muted p-2 transition hover:bg-accent"
                          title={sub.description}
                        >
                          <strong className="text-primary">{sub.label}</strong>: {sub.description}
                        </li>
                      ))}
                    </ul>
                  )}

                  {expanded && step.details && typeof step.details === "string" && (
                    <div className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {step.details}
                    </div>
                  )}

                  {course && (
                    <div className="mt-4 rounded border border-border bg-muted p-3 text-sm">
                      <strong className="text-primary">Course:</strong> {course.title} <br />
                      <span className="text-muted-foreground">{course.description}</span>
                      {institution && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Provided by:</strong> {institution.name} <br />
                          <span>{institution.address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <label
                      htmlFor={`status-${step.id}`}
                      className="mb-1 block text-sm font-medium text-foreground"
                    >
                      Change Status:
                    </label>
                    <select
                      id={`status-${step.id}`}
                      value={status}
                      onChange={(e) => handleStatusChange(step.id, e.target.value)}
                      disabled={savingSteps[step.id]}
                      className="rounded border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </VerticalTimelineElement>
              );
            })}
          </VerticalTimeline>
          </>
        )}

        <PlansModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} />
      </div>
    </DashboardLayout>
  );
}
