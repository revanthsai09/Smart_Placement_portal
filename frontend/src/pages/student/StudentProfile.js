import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import { getProfile, updateProfile, uploadResume } from '../../api/studentApi';

const StudentProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', college: '', branch: '', year: '', cgpa: '', skills: '', resumeUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getProfile().then(res => setProfile(res.data || {})).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: '', text: '' }), 3500); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await updateProfile(profile);
      setProfile(res.data);
      showMsg('success', 'Profile updated successfully! ✅');
    } catch (err) { showMsg('error', err.response?.data?.error || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.pdf')) { showMsg('error', 'Only PDF files allowed.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadResume(formData);
      setProfile(prev => ({ ...prev, resumeUrl: res.data.resumeUrl }));
      showMsg('success', 'Resume uploaded successfully! 📄');
    } catch (err) { showMsg('error', err.response?.data?.error || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="layout"><Sidebar /><div className="main-content"><Loader /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content fade-in">
        <div className="page-header">
          <h1>My Profile 👤</h1>
          <p>Keep your information updated to attract recruiters</p>
        </div>

        {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Personal Information</h3>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input value={profile.name || ''} disabled style={{ opacity: 0.6 }} /></div>
                <div className="form-group"><label>Email</label><input value={profile.email || ''} disabled style={{ opacity: 0.6 }} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>College / University</label><input id="college" placeholder="e.g. IIT Delhi" value={profile.college || ''} onChange={e => setProfile({ ...profile, college: e.target.value })} /></div>
                <div className="form-group"><label>Branch</label><input id="branch" placeholder="e.g. Computer Science" value={profile.branch || ''} onChange={e => setProfile({ ...profile, branch: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Year of Study</label>
                  <select id="year" value={profile.year || ''} onChange={e => setProfile({ ...profile, year: e.target.value })}>
                    <option value="">Select Year</option>
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>CGPA</label><input id="cgpa" type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5" value={profile.cgpa || ''} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} /></div>
              </div>
              <div className="form-group">
                <label>Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                <input id="skills" placeholder="e.g. Java, Spring Boot, React, MySQL" value={profile.skills || ''} onChange={e => setProfile({ ...profile, skills: e.target.value })} />
              </div>
              <button id="save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Resume 📄</h3>
            {profile.resumeUrl ? (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ padding: '14px', background: 'rgba(0,212,170,0.1)', borderRadius: '10px', border: '1px solid rgba(0,212,170,0.2)', marginBottom: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', marginBottom: '6px' }}>📄</p>
                  <p style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: 600 }}>Resume uploaded</p>
                </div>
                <a href={`${process.env.REACT_APP_API_BASE_URL || ''}${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginBottom: '8px' }}>👁️ View Resume</a>
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '10px', border: '2px dashed var(--border)', marginBottom: '16px' }}>
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>📁</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No resume uploaded yet</p>
              </div>
            )}
            <label htmlFor="resume-upload" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex', cursor: 'pointer' }}>
              {uploading ? 'Uploading...' : '⬆️ Upload PDF Resume'}
            </label>
            <input id="resume-upload" type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: 'none' }} disabled={uploading} />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>PDF only, max 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
