// StepFormWrapper.jsx
import React, { useState } from "react";
import Step1PersonalDetails from "./Step1PersonalDetails";
import Step2CareerGoals from "./Step2CareerGoals";
import Step3SkillsExperience from "./Step3SkillsExperience";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "@/context/AuthContext";
import BackButton from "../components/BackButton"; 
import ThemeToggle from "@/components/ThemeToggle";

const UserInfo = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = async (data) => {
    const combinedData = { ...formData, ...data };
  
    if (step < 3) {
      setFormData(combinedData);
      setStep(step + 1);
    } else {
      try {
        setLoading(true);
        setError("");
  
        const token = localStorage.getItem("token"); // Assuming you store JWT here
        const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;
  
        // 1. Save profile to DB using protected route
        await api.post("/profile", { ...combinedData }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // 2. Generate roadmap
        await api.post("/roadmap", { userId, ...combinedData });
  
        // 3. Generate secondary React Flow roadmap
        await api.post("/career/generate", { userId });
  
        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Error in final step:", err);
        setError("We couldn't finish setting up your roadmap. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handlePrev = () => setStep(step - 1);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00ADB5] mb-6"></div>
        <p className="text-xl font-semibold">Generating your personalized roadmap...</p>
        <p className="text-sm text-muted-foreground mt-2">Hang tight! This may take a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
      {/* Top-left back button */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton to={-1} label="Back" />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="mb-4 text-center text-muted-foreground text-sm" aria-live="polite">Step {step} of 3</div>
        <div
          className="w-full bg-muted rounded-full h-2 mb-6"
          role="progressbar"
          aria-label="Profile setup progress"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
        >
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        {error && <p role="alert" className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-error">{error}</p>}
        {step === 1 && <Step1PersonalDetails onNext={handleNext} initialValues={formData} />}
        {step === 2 && <Step2CareerGoals onNext={handleNext} onBack={handlePrev} initialValues={formData} />}
        {step === 3 && <Step3SkillsExperience onNext={handleNext} onBack={handlePrev} initialValues={formData} />}

      </div>
    </div>
  );
};

export default UserInfo;
