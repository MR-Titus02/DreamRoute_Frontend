import React, { useState } from 'react';

const Step3SkillsExperience = ({ onNext, onBack, initialValues = {} }) => {
  const [form, setForm] = useState({
    educationLevel: '',
    studyLanguage: '',
    budget: '',
    experience: '',
    certifications: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState({});

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!form.educationLevel) newErrors.educationLevel = "Education level is required.";
    if (!form.studyLanguage) newErrors.studyLanguage = "Study language is required.";
    if (!form.budget) newErrors.budget = "Budget is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext(form);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-card p-6 rounded-lg shadow text-card-foreground">
      <h2 className="text-xl font-bold mb-4 text-foreground">Step 3: Skills & Preferences</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="education-level" className="mb-1 block text-sm font-medium">Education level</label>
          <select
            id="education-level"
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          >
            <option value="" disabled hidden>Select Education Level</option>
            <option>High School</option>
            <option>Diploma</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Other</option>
          </select>
          {errors.educationLevel && (
            <p role="alert" className="text-error text-sm mt-1">{errors.educationLevel}</p>
          )}
        </div>

        <div>
          <label htmlFor="study-language" className="mb-1 block text-sm font-medium">Preferred language</label>
          <select
            id="study-language"
            name="studyLanguage"
            value={form.studyLanguage}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          >
            <option value="" disabled hidden>Preferred Language</option>
            <option>English</option>
            <option>Tamil</option>
            <option>Sinhala</option>
          </select>
          {errors.studyLanguage && (
            <p role="alert" className="text-error text-sm mt-1">{errors.studyLanguage}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget-range" className="mb-1 block text-sm font-medium">Budget range</label>
          <select
            id="budget-range"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          >
            <option value="" disabled hidden>Budget Range</option>
            <option>No Cost</option>
            <option>Up to ₹5,000</option>
            <option>₹5,000 - ₹25,000</option>
            <option>₹25,000 - ₹1 Lakh</option>
            <option>₹1 Lakh - ₹5 Lakhs</option>
            <option>₹5 Lakhs - ₹10 Lakhs</option>
            <option>₹10 Lakhs - ₹20 Lakhs</option>
            <option>Above ₹20 Lakhs</option>
          </select>
          {errors.budget && (
            <p role="alert" className="text-error text-sm mt-1">{errors.budget}</p>
          )}
        </div>

        <div>
          <label htmlFor="experience" className="mb-1 block text-sm font-medium">Past experience <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            id="experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Describe your past experience"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="certifications" className="mb-1 block text-sm font-medium">Relevant certifications <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input
            id="certifications"
            name="certifications"
            value={form.certifications}
            onChange={handleChange}
            placeholder="Comma separated"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3SkillsExperience;
