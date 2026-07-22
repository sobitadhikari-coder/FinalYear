// src/components/tuition/TuitionForm.jsx

import { useState, useMemo } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const TuitionForm = ({ initialData, onSubmit, subjects = [] }) => {
  // If editing, include the existing subject in the dropdown if it's not already there
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
    <Card>
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? 'Edit Tuition' : 'Create Tuition'}
      </h3>

      {!hasSubjects && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          Please add subjects in your profile first, then return here to create a tuition.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Subject dropdown – always shown, but disabled if no options */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Subject <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={!hasSubjects}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={!hasSubjects}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </form>
    </Card>
  );
};

export default TuitionForm;