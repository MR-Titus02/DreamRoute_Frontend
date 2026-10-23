import React, { useState } from 'react';

const interestOptions = [
  "Problem Solving", "Design", "Mathematics", "Communication", "Research",
  "Teamwork", "Leadership", "Innovation", "Security", "Artificial Intelligence",
  "Data Analysis", "Cloud Computing",
];

const Step2CareerGoals = ({ onNext, onBack, initialValues = {} }) => {
  const [form, setForm] = useState({
    preferredCareer: '',
    interestAreas: [],
    shortTermGoals: '',
    longTermGoals: '',
    dreamCompany: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const isSelected = prev.interestAreas.includes(interest);
      return {
        ...prev,
        interestAreas: isSelected
          ? prev.interestAreas.filter((i) => i !== interest)
          : [...prev.interestAreas, interest],
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.preferredCareer) newErrors.preferredCareer = "Preferred career is required.";
    if (form.interestAreas.length === 0) newErrors.interestAreas = "Select at least one interest area.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-card p-6 rounded-lg shadow text-card-foreground">
      <h2 className="text-xl font-bold mb-4 text-foreground">Step 2: Career Goals</h2>
      <div className="space-y-4 text-foreground">
        {/* Preferred Career */}
        <div>
          <label htmlFor="preferred-career" className="mb-1 block text-sm font-medium">Preferred career</label>
          <select
            id="preferred-career"
            name="preferredCareer"
            value={form.preferredCareer}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          >
            <option value="">Select Preferred Career</option>
            {[
              "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
              "Data Scientist", "Machine Learning Engineer", "Cybersecurity Analyst", "DevOps Engineer",
              "UI/UX Designer", "Product Manager", "QA Engineer", "IT Support Specialist", "Cloud Engineer"
            ].map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
          {errors.preferredCareer && (
            <p role="alert" className="text-error text-sm mt-1">{errors.preferredCareer}</p>
          )}
        </div>

        {/* Interest Areas - Tag Style */}
        <div>
          <span className="mb-2 block text-sm font-medium">Interest areas:</span>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const isSelected = form.interestAreas.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full border transition ${
                    isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary'
                  }`}
                    aria-pressed={isSelected}
                >
                  {interest}
                </button>
              );
            })}
          </div>
          {errors.interestAreas && (
            <p role="alert" className="text-error text-sm mt-1">{errors.interestAreas}</p>
          )}
        </div>

        {/* Short Term Goals */}
        <div>
          <label htmlFor="short-term-goals" className="mb-1 block text-sm font-medium">Short-term goals <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            id="short-term-goals"
            name="shortTermGoals"
            value={form.shortTermGoals}
            onChange={handleChange}
            placeholder="Short Term Goals (optional)"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
        </div>

        {/* Long Term Goals */}
        <div>
          <label htmlFor="long-term-goals" className="mb-1 block text-sm font-medium">Long-term goals <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            id="long-term-goals"
            name="longTermGoals"
            value={form.longTermGoals}
            onChange={handleChange}
            placeholder="Long Term Goals (optional)"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
        </div>

        {/* Dream Company */}
        <label htmlFor="dream-company" className="mb-1 block text-sm font-medium">Dream company <span className="font-normal text-muted-foreground">(optional)</span></label>
        <input
          id="dream-company"
          name="dreamCompany"
          value={form.dreamCompany}
          onChange={handleChange}
          placeholder="Dream Company (optional)"
          className="w-full rounded border border-input bg-background p-2 text-foreground"
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button type="button" onClick={onBack} className="bg-secondary text-secondary-foreground px-4 py-2 rounded">Back</button>
          <button type="button" onClick={handleSubmit} className="bg-primary text-primary-foreground px-4 py-2 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step2CareerGoals;
