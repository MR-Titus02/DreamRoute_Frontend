import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const institutions = ["DreamRoute Academy", "CodeHub Institute", "SkillForge"];
const courses = ["Fullstack Web Dev", "AI Career Pathing", "Cybersecurity Essentials"];

function Feedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "institution",
    target: "",
    rating: 0,
    message: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [submissionNotice, setSubmissionNotice] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, target: "" });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionNotice("Feedback is not connected to a submission service yet. Nothing has been sent or saved.");
  };

  const options = formData.type === "institution" ? institutions : courses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#222831] via-[#393E46] to-[#222831] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="DreamRoute Logo" className="w-14 h-14 rounded-lg shadow" />
          <h1 className="text-xl font-extrabold">DreamRoute</h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:text-white text-sm transition"
        >
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Leave Your Feedback</h2>
          <p className="text-sm text-center text-white/70 mb-6">
            Help us improve by rating your experience
          </p>
          <p className="mb-5 rounded-lg border border-white/20 bg-white/5 p-3 text-sm text-white/80">
            This form is a preview. The institution and course options are sample data; feedback is not sent or saved.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="feedback-name" className="block text-sm mb-1 text-white/80">Your Name</label>
              <input
                id="feedback-name"
                type="text"
                name="name"
                value={formData.name}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border bg-white/5 placeholder-white/50 text-white transition-all ${
                  focusedField === "name"
                    ? "border-[#00ADB5] bg-white/10 shadow shadow-[#00ADB5]/30"
                    : "border-white/20 hover:border-white/40"
                }`}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <label htmlFor="feedback-type" className="block text-sm mb-1 text-white/80">Feedback For</label>
              <select
                id="feedback-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white border border-white/20 text-white"
              >
                <option value="institution">Institution</option>
                <option value="course">Course</option>
              </select>
            </div>

            {/* Target Dropdown */}
            <div>
              <label className="block text-sm mb-1 text-white/80">
                {formData.type === "institution" ? "Institution" : "Course"} Name
              </label>
              <select
                aria-label={`${formData.type === "institution" ? "Institution" : "Course"} name`}
                name="target"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                <option value="">-- Select --</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm mb-1 text-white/80">Your Rating</label>
              <div className="flex gap-1" role="group" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                    aria-pressed={formData.rating === star}
                    className={`rounded p-1 text-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ADB5] ${
                      formData.rating >= star ? "text-yellow-400" : "text-white/30"
                    }`}
                    onClick={() => handleRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="feedback-message" className="block text-sm mb-1 text-white/80">Your Message</label>
              <textarea
                id="feedback-message"
                name="message"
                value={formData.message}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField("")}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border bg-white/5 placeholder-white/50 text-white h-28 resize-none transition-all ${
                  focusedField === "message"
                    ? "border-[#00ADB5] bg-white/10 shadow shadow-[#00ADB5]/30"
                    : "border-white/20 hover:border-white/40"
                }`}
                placeholder="Write your feedback..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#00C4CC] text-white font-semibold py-2 rounded-lg hover:from-[#00C4CC] hover:to-[#00ADB5] transition-all hover:shadow-lg hover:scale-[1.01]"
            >
              Preview Feedback
            </button>

            {submissionNotice && (
              <p role="status" className="mt-2 text-center text-amber-200">
                {submissionNotice}
              </p>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-4 text-sm border-t border-white/10 bg-black/10 backdrop-blur-sm">
        © 2025 DreamRoute. All rights reserved.
      </footer>
    </div>
  );
}

export default Feedback;
