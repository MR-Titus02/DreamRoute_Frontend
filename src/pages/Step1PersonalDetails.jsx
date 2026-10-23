import React, { useState, useEffect } from 'react';

const Step1PersonalDetails = ({ onNext, initialValues = {} }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    location: '',
    ...initialValues, // preload values if coming back
  });

  const [errors, setErrors] = useState({});

  // Load user data from localStorage and prefill fullName and email only if not already filled
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm((prevForm) => ({
        ...prevForm,
        fullName: prevForm.fullName || user.name || '',
        email: prevForm.email || user.email || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full Name is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    if (!form.dob) newErrors.dob = 'Date of Birth is required.';
    if (!form.gender) newErrors.gender = 'Gender is required.';
    // if (!form.location) newErrors.location = 'Location is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
    onNext({ ...form, age });
  };

  return (
    <div className="max-w-xl mx-auto bg-card p-6 rounded-lg shadow text-card-foreground">
      <h2 className="text-xl font-bold mb-4 text-foreground">Step 1: Personal Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="profile-full-name" className="mb-1 block text-sm font-medium">Full name</label>
          <input
            id="profile-full-name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
          {errors.fullName && <p role="alert" className="text-error text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="profile-email" className="mb-1 block text-sm font-medium">Email address</label>
          <input
            id="profile-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
          {errors.email && <p role="alert" className="text-error text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="profile-dob" className="mb-1 block text-sm font-medium">Date of birth</label>
          <input
            id="profile-dob"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
          {errors.dob && <p role="alert" className="text-error text-sm mt-1">{errors.dob}</p>}
        </div>

        <div>
          <label htmlFor="profile-gender" className="mb-1 block text-sm font-medium">Gender</label>
          <select
            id="profile-gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          >
            <option value="" disabled hidden>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && <p role="alert" className="text-error text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label htmlFor="profile-location" className="mb-1 block text-sm font-medium">Location <span className="font-normal text-muted-foreground">(optional)</span></label>
          <input
            id="profile-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, Country)"
            className="w-full rounded border border-input bg-background p-2 text-foreground"
          />
          {errors.location && <p role="alert" className="text-error text-sm mt-1">{errors.location}</p>}
        </div>

        <button
          onClick={handleSubmit}
          type="button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1PersonalDetails;
