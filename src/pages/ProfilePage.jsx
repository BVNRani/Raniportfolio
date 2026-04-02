// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { getProfile, saveProfile, uploadPhoto } from '../firebase/services';
import { Save, User, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const PLATFORMS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'www.linkedin.com/in/...',
    buildUrl: v => `https://${v}`,
    color: '#0A66C2',
  },
  {
    key: 'googleScholar',
    label: 'Google Scholar',
    placeholder: 'scholar.google.com/citations?user=...',
    buildUrl: v => `https://${v}`,
    color: '#4285F4',
  },
  {
    key: 'orcid',
    label: 'ORCID iD',
    placeholder: '0000-0000-0000-0000',
    buildUrl: v => `https://orcid.org/${v}`,
    color: '#A6CE39',
  },
  {
    key: 'researcherId',
    label: 'ResearcherID (WoS)',
    placeholder: 'PA-2013-0030',
    buildUrl: null, // no standard deep link
    color: '#CC0000',
  },
  {
    key: 'researchGate',
    label: 'ResearchGate',
    placeholder: 'www.researchgate.net/profile/...',
    buildUrl: v => `https://${v}`,
    color: '#00CCBB',
  },
  {
    key: 'scopusId',
    label: 'Scopus Author ID',
    placeholder: 'e.g. 57203123456',
    buildUrl: v => `https://www.scopus.com/authid/detail.uri?authorId=${v}`,
    color: '#E9711C',
  },
  {
    key: 'semanticScholar',
    label: 'Semantic Scholar',
    placeholder: 'www.semanticscholar.org/author/...',
    buildUrl: v => `https://${v}`,
    color: '#1857B6',
  },
];

const SPECIALIZATIONS = [
  'Artificial Intelligence', 'Cybersecurity', 'Blockchain',
  'Post-Quantum Cryptography', 'Cloud Computing', 'Internet of Things',
  'Machine Learning', 'NLP', 'Deep Learning', 'Data Analytics',
  'Homomorphic Encryption', 'Cyber-Physical Systems'
];

export default function ProfilePage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    getProfile().then(p => {
      if (p) setForm(p);
      setLoading(false);
    });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleSpec = (s) => {
    const current = form.specializations || [];
    setForm({
      ...form,
      specializations: current.includes(s) ? current.filter(x => x !== s) : [...current, s]
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photoUrl = form.photoUrl || '';
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile, 'profile');
        toast.success('Photo uploaded!');
      }
      await saveProfile({ ...form, photoUrl });
      toast.success('Profile saved successfully!');
      setPhotoFile(null);
    } catch (e) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  const displayPhoto = photoPreview || form.photoUrl;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Photo Section */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.1)', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div
            onClick={() => document.getElementById('profile-photo').click()}
            style={{ width: 150, height: 150, borderRadius: '50%', cursor: 'pointer', overflow: 'hidden', border: '3px solid #B48C3C', boxShadow: '0 0 0 6px rgba(180,140,60,0.12)', position: 'relative' }}
          >
            {displayPhoto
              ? <img src={displayPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
                  <User size={40} />
                  <span style={{ fontSize: 11, marginTop: 6 }}>Upload Photo</span>
                </div>
              )
            }
          </div>
          <input id="profile-photo" type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => document.getElementById('profile-photo').click()}>
            Change Photo
          </button>
          {photoFile && <div style={{ fontSize: 12, color: '#2E7D52', marginTop: 6, fontWeight: 600 }}>✓ Ready to upload</div>}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: '#0A1F44', marginBottom: 6 }}>Profile Information</h2>
          <p style={{ color: '#A09890', fontSize: 13.5, marginBottom: 20 }}>This information appears on your portfolio dashboard and exported PDF.</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Designation / Title</label>
              <input className="form-input" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input className="form-input" value={form.institution || ''} onChange={e => setForm({ ...form, institution: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.1)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 20 }}>Contact & Location</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input className="form-input" value={form.experience || ''} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="18+" />
          </div>
          <div className="form-group">
            <label className="form-label">Ph.D. Scholars Supervised</label>
            <input className="form-input" value={form.phdScholars || ''} onChange={e => setForm({ ...form, phdScholars: e.target.value })} placeholder="4" />
          </div>
        </div>
      </div>

      {/* Online Profiles */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.1)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 6 }}>Online Academic Profiles</h3>
        <p style={{ color: '#A09890', fontSize: 13, marginBottom: 20 }}>Add your profile links — click ↗ to verify each one opens correctly.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {PLATFORMS.map(({ key, label, placeholder, buildUrl, color }) => {
            const val = form[key] || '';
            const url = val && buildUrl ? buildUrl(val) : null;
            return (
              <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: val ? color : '#E2E0DC', display: 'inline-block' }} />
                  {label}
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    value={val}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                  />
                  {buildUrl && (
                    <a
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={url ? `Open ${label}` : 'Enter a value first'}
                      onClick={e => { if (!url) e.preventDefault(); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: url ? color + '18' : '#F4F3F0',
                        border: `1px solid ${url ? color + '44' : '#E2E0DC'}`,
                        color: url ? color : '#C0BAB5',
                        cursor: url ? 'pointer' : 'not-allowed',
                        textDecoration: 'none', transition: 'all 0.15s',
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge preview row */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F0EFEb' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#A09890', letterSpacing: 0.5, marginBottom: 10 }}>ACTIVE PROFILE LINKS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.map(({ key, label, buildUrl, color }) => {
              const val = form[key] || '';
              const url = val && buildUrl ? buildUrl(val) : null;
              return url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: color + '12', border: `1px solid ${color}44`,
                    color, borderRadius: 20, padding: '5px 14px',
                    fontSize: 12, fontWeight: 700, textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  {label}
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#F4F3F0', border: '1px solid #E2E0DC',
                    color: '#C0BAB5', borderRadius: 20, padding: '5px 14px',
                    fontSize: 12, fontWeight: 600,
                  }}
                >
                  {label}: not set
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Research Metrics */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.1)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 6 }}>Research Metrics</h3>
        <p style={{ color: '#A09890', fontSize: 13, marginBottom: 20 }}>Update these manually from your Google Scholar profile. They appear on the Insights page.</p>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Citations</label>
            <input className="form-input" type="number" value={form.citations || ''} onChange={e => setForm({ ...form, citations: e.target.value })} placeholder="e.g. 120" />
          </div>
          <div className="form-group">
            <label className="form-label">h-index</label>
            <input className="form-input" type="number" value={form.hIndex || ''} onChange={e => setForm({ ...form, hIndex: e.target.value })} placeholder="e.g. 7" />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.1)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 20 }}>Professional Summary</h3>
        <div className="form-group">
          <textarea className="form-textarea" style={{ minHeight: 130 }} value={form.summary || ''} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Write your professional summary..." />
        </div>
      </div>

      {/* Specializations */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: '0 2px 8px rgba(10,31,68,0.1)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 6 }}>Research Specializations</h3>
        <p style={{ color: '#A09890', fontSize: 13, marginBottom: 16 }}>Select all that apply</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SPECIALIZATIONS.map(s => {
            const active = (form.specializations || []).includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSpec(s)}
                style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: active ? '1.5px solid #B48C3C' : '1.5px solid #E2E0DC',
                  background: active ? 'linear-gradient(135deg, #0A1F44, #1E3A7A)' : 'white',
                  color: active ? '#D4AF37' : '#6A6560',
                  transition: 'all 0.2s'
                }}
              >
                {active ? '✓ ' : ''}{s}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn btn-gold" style={{ fontSize: 15, padding: '12px 32px' }} onClick={handleSave} disabled={saving}>
        <Save size={16} />
        {saving ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  );
}
