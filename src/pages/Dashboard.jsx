import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchRoadmap, fetchProgress } from "@/api/roadmap";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const storedUser = localStorage.getItem("user");
  let storedUserId;
  try {
    storedUserId = storedUser ? JSON.parse(storedUser)?.id : undefined;
  } catch (error) {
    console.error("Failed to read stored user:", error);
  }
  const userId = user?.id || storedUserId;

  const [career, setCareer] = useState("");
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [flatSteps, setFlatSteps] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const percentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  let message = "You're just starting out!";
  if (percentage >= 25) message = "You're making good progress!";
  if (percentage >= 50) message = "You're halfway there!";
  if (percentage >= 75) message = "Almost there!";
  if (percentage === 100) message = "🎉 You've completed your roadmap!";

  const loadDashboardData = useCallback(async () => {
      if (authLoading) return;
      if (!userId) {
        setLoadError("Your account could not be identified. Please sign in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");
      try {
        const { career, roadmap } = await fetchRoadmap(userId);

        // Check if this is a new user with no profile data
        const userData = storedUser ? JSON.parse(storedUser) : user;
        if ((!career || !roadmap) && !userData?.profileCompleted) {
          setIsNewUser(true);
          setShowProfileModal(true);
          return;
        }

        if (!roadmap || roadmap.length === 0) {
          setCareer(""); // no roadmap
          setFlatSteps([]);
          setProgressData([]);
          setTotalSteps(0);
          setCompletedSteps(0);
          return;
        }

        const steps = Array.isArray(roadmap[0]?.steps)
          ? roadmap.flatMap((section) =>
              section.steps.map((step) => ({
                ...step,
                section: section.section,
              }))
            )
          : roadmap;

        steps.sort((a, b) => Number(a.id) - Number(b.id));

        setCareer(career);
        setFlatSteps(steps);
        setTotalSteps(steps.length);

        const progress = await fetchProgress(userId);
        if (!Array.isArray(progress)) {
          throw new Error("Unexpected progress response.");
        }
        setProgressData(progress);

        const statusByStep = new Map(
          progress.map((item) => [String(item.step_id), item.status]),
        );
        const doneCount = steps.filter((step) =>
          ["done", "completed"].includes(statusByStep.get(String(step.id))),
        ).length;
        setCompletedSteps(doneCount);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setLoadError("We couldn't load your dashboard data. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
  }, [authLoading, storedUser, user, userId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleProfileComplete = () => {
    // Update user data in localStorage to mark profile as completed
    const userData = storedUser ? JSON.parse(storedUser) : user;
    localStorage.setItem("user", JSON.stringify({ ...userData, profileCompleted: true }));
    setShowProfileModal(false);
    navigate("/userdetails");
  };

  const handleCloseAttempt = () => {
    if (isNewUser) {
      setShowConfirmClose(true);
    } else {
      setShowProfileModal(false);
    }
  };

  const handleConfirmClose = () => {
    setShowProfileModal(false);
    setShowConfirmClose(false);
  };

  const handleCancelClose = () => {
    setShowConfirmClose(false);
  };

  const remainingSteps = totalSteps - completedSteps;

  const progressMap = {};
  progressData.forEach((item) => {
    if (item.step_id !== undefined && item.step_id !== null) {
      progressMap[item.step_id.toString()] = item.status;
    }
  });

  const nextStep = flatSteps.find((step) => {
    if (!step.id) return false;
    const status = progressMap[step.id.toString()] || "not started";
    return status !== "done" && status !== "completed";
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div role="status" className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Loading your dashboard…
        </div>
      </DashboardLayout>
    );
  }

return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold text-foreground">Your dashboard</h1>
      {loadError && (
        <div role="alert" className="mb-6 flex flex-col gap-3 rounded-lg border border-error/30 bg-destructive/10 p-4 text-error sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          <Button variant="outline" onClick={loadDashboardData}>Try again</Button>
        </div>
      )}
      {/* Profile Completion Modal - Enhanced */}
      <Dialog open={showProfileModal} onOpenChange={handleCloseAttempt}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border border-border bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {isNewUser ? (
                <span className="flex items-center gap-2">
                  <span className="text-blue-400">👋</span> Welcome to DreamRoute!
                </span>
              ) : (
                "Complete Your Profile"
              )}
            </DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              {isNewUser
                ? "Let's create your personalized career roadmap in just 2 minutes."
                : "Update your profile for better recommendations."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
              <div className="text-blue-400 mt-0.5">ℹ️</div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isNewUser 
                    ? "This helps us tailor recommendations to your goals"
                    : "Your information helps us improve suggestions"}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Quick and easy setup</li>
                  <li>Data privacy guaranteed</li>
                  <li>Editable anytime</li>
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleProfileComplete}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isNewUser ? "Begin Setup" : "Update Profile"}
            </Button>
            {!isNewUser && (
              <Button
                onClick={handleCloseAttempt}
                variant="outline"
                className="w-full"
              >
                Remind Me Later
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog - Styled */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent className="rounded-lg border border-border bg-card text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <span className="text-yellow-400">⚠️</span> Required Step
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-muted-foreground">
              You need to complete your profile to unlock all features.
              <br />
              <span className="mt-1 inline-block font-medium text-primary">
                This ensures you get the best recommendations.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel 
              onClick={handleCancelClose}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Continue Setup
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Exit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!loadError && (!career ? (
        <Card className="mb-6 border-border bg-card text-card-foreground shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              Setup your career profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Complete your profile to generate a personalized career roadmap.
            </p>
            <Button
              onClick={() => navigate("/userdetails")}
              className="rounded-lg"
            >
              Start Setup
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Career Recommendation Card - Enhanced */}
          <Card className="mb-6 border-border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                Your career path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Our AI recommends:{" "}
                <span className="font-medium text-primary">{career}</span>
              </p>
              <Button
                onClick={() => navigate("/dashboard/roadmap")}
                className="rounded-lg"
              >
                View Full Roadmap
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card - Enhanced */}
          <Card className="border-border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                Your progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="mb-1 text-muted-foreground">
                    Completed: <span className="font-medium text-success">{completedSteps}</span>/{totalSteps}
                  </p>
                  <p className="font-medium text-primary">
                    {percentage}% Complete
                  </p>
                </div>
                <div
                  className="h-2.5 w-40 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="Roadmap completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                >
                  <div
                    className="h-2.5 bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-border bg-muted p-3">
                <p className="text-center font-medium text-foreground">
                  {message} {remainingSteps > 0 && (
                    <span className="text-muted-foreground">
                      - {remainingSteps} step{remainingSteps !== 1 ? "s" : ""} remaining
                    </span>
                  )}
                </p>
              </div>

              <div className="mb-6 space-y-3">
                {flatSteps.slice(0, 5).map((step) => {
                  const status = progressMap[String(step.id)];
                  const isCompleted = status === "done" || status === "completed";
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start p-3 rounded-lg border ${
                        isCompleted 
                          ? "bg-success/10 border-success/30"
                          : "bg-background border-border hover:bg-muted transition-colors"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          isCompleted
                            ? "bg-success text-white"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p
                          className={`${
                            isCompleted
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.section && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {step.section}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {nextStep && (
                <Button
                  onClick={() => navigate(`/dashboard/roadmap?step=${nextStep.id}`)}
                  className="rounded-lg"
                >
                  Continue with "{nextStep.label.substring(0, 30)}{nextStep.label.length > 30 ? "..." : ""}"
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      ))}
    </DashboardLayout>
  );
}