// src/components/profile/CVUpload.jsx

import { useState } from 'react';
import { updateTeacherProfile } from '../../api/profile';
import Button from '../common/Button';

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setUploading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('cv', file);
      await updateTeacherProfile(formData);
      setMessage('CV uploaded successfully. Awaiting admin verification.');
      // Do NOT reload – message stays visible.
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-dashed border-gray-400 rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Upload CV (for verification)</h3>
      <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="mb-2" />
      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload CV'}
      </Button>
      {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CVUpload;