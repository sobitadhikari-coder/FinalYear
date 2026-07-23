// src/components/tuition/TuitionForm.jsx

import { useState, useMemo } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const TuitionForm = ({ initialData, onSubmit, subjects = [] }) => {
  const subjectOptions = useMemo(() => {
    if (initialData?.subject && !subjects.includes(initialData.subject)) {
      return [initialData.subject, ...subjects];
    }
    return subjects;
  }, [subjects, initialData]);

  const [subject, setSubject] = useState(initialData?.subject || '');
  const [className, setClassName] = useState(initialData?.class_name || '');
  const [pricePerMonth, setPricePerMonth] = useState(initialData?.price_per_month || '');
  const [hours, setHours] = useState(initialData?.hours || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({
        subject,
        class_name: className,
        price_per_month: Number(pricePerMonth),
        hours: Number(hours),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const hasSubjects = subjects.length > 0;

  return (
    <Card className="shadow-xl border-0">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {initialData ? 'Edit Tuition' : 'Create Tuition'}
        </h3>
      </div>

      {!hasSubjects && (
        <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Please add subjects in your profile first, then return here to create a tuition.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Subject dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 tracking-wide">
            Subject <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={!hasSubjects}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100
                       hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
                       transition-all duration-200 ease-in-out"
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <Input
          label="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="e.g., Grade 10"
          required
        />
        <Input
          label="Price per Month (Rs.)"
          type="number"
          value={pricePerMonth}
          onChange={(e) => setPricePerMonth(e.target.value)}
          placeholder="5000"
          required
          min="0"
        />
        <Input
          label="Hours per Day"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="2"
          required
          min="0"
        />

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <Button type="submit" disabled={!hasSubjects} size="lg">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </form>
    </Card>
  );
};

export default TuitionForm;