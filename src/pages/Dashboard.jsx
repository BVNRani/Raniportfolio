// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getProfile, getCollection } from '../firebase/services';
import { generatePortfolioPDF } from '../utils/generatePDF';
import { Mail, Phone, MapPin, Link2, Award, BookOpen, Shield, FlaskConical, ExternalLink, GraduationCap, Briefcase, Download } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ publications: 0, patents: 0, awards: 0, projects: 0 });
  const [loading, setLoading] = useState(true);
  const [recentPubs, setRecentPubs] = useState([]);
  const [recentAwards, setRecentAwards] = useState([]);
  const [allPubs, setAllPubs] = useState([]);
  const [allPatents, setAllPatents] = useState([]);
  const [allAwards, setAllAwards] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, pubs, patents, awards, projects, edu, exp] = await Promise.all([
          getProfile(),
          getCollection('publications'),
          getCollection('patents'),
          getCollection('awards'),
          getCollection('projects'),
          getCollection('education'),
          getCollection('experience'),
        ]);
        setProfile(p);
        setCounts({ publications: pubs.length, patents: patents.length, awards: awards.length, projects: projects.length });
        setAllPubs(pubs);
        setAllPatents(patents);
        setAllAwards(awards);
        setAllProjects(projects);
        setEducation(edu);
        setExperience(exp);
        setRecentPubs(pubs.slice(0, 3));
        setRecentAwards(awards.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExportCV = async () => {
    setExporting(true);
    try {
      generatePortfolioPDF({
        profile,
        publications: allPubs,
        patents: allPatents,
        awards: allAwards,
        projects: allProjects,
        education,
        experience,
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;
  if (error) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#e53e3e' }}>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>Failed to load data</p>
      <p style={{ fontSize: 13, color: '#666' }}>{error}</p>
      <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>Make sure the Supabase SQL tables have been created in the dashboard.</p>
    </div>
  );

  return (
    <div>
      {/* Hero Profile Card */}
      <div className="hero-card">
        <div className="hero-photo-wrap">
          {profile?.photoUrl
            ? <img src={profile.photoUrl} alt="Profile" className="hero-photo" />
            : (
              <div className="hero-photo-placeholder">
                <span style={{ fontSize: 32 }}>👩‍🎓</span>
                <span>Upload Photo</span>
              </div>
            )
          }
        </div>
        <div className="hero-info">
          <div className="hero-name">{profile?.name || 'Dr. Venkata Naga Rani Bandaru'}</div>
          <div className="hero-title">{profile?.title}</div>
          <div className="hero-institution">{profile?.department} · {profile?.institution}</div>
          <div className="hero-tags">
            {(profile?.specializations || []).map(s => <span key={s} className="hero-tag">{s}</span>)}
          </div>
          <div className="hero-meta">
            {profile?.email    && <div className="hero-meta-item"><Mail size={13} />{profile.email}</div>}
            {profile?.phone    && <div className="hero-meta-item"><Phone size={13} />{profile.phone}</div>}
            {profile?.location && <div className="hero-meta-item"><MapPin size={13} />{profile.location}</div>}
          </div>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {profile?.orcid && (
            <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <Link2 size={12} /> ORCID
            </a>
          )}
          {profile?.linkedin && (
            <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <ExternalLink size={12} /> LinkedIn
            </a>
          )}
          {profile?.googleScholar && (
            <a href={`https://${profile.googleScholar}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <GraduationCap size={12} /> Scholar
            </a>
          )}
          {profile?.researchGate && (
            <a href={`https://${profile.researchGate}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <ExternalLink size={12} /> ResearchGate
            </a>
          )}
          <button className="btn btn-gold btn-sm" onClick={handleExportCV} disabled={exporting}>
            <Download size={12} /> {exporting ? 'Generating…' : 'Export CV'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <Briefcase size={18} style={{ color: '#B48C3C', margin: '0 auto 8px' }} />
          <div className="stat-number">{profile?.experience || '18+'}</div>
          <div className="stat-label">Yrs Experience</div>
        </div>
        <div className="stat-card">
          <BookOpen size={18} style={{ color: '#B48C3C', margin: '0 auto 8px' }} />
          <div className="stat-number">{counts.publications}</div>
          <div className="stat-label">Publications</div>
        </div>
        <div className="stat-card">
          <Shield size={18} style={{ color: '#2563eb', margin: '0 auto 8px' }} />
          <div className="stat-number">{counts.patents}</div>
          <div className="stat-label">Patents</div>
        </div>
        <div className="stat-card">
          <Award size={18} style={{ color: '#B48C3C', margin: '0 auto 8px' }} />
          <div className="stat-number">{counts.awards}</div>
          <div className="stat-label">Awards</div>
        </div>
        <div className="stat-card">
          <FlaskConical size={18} style={{ color: '#7c3aed', margin: '0 auto 8px' }} />
          <div className="stat-number">{counts.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <GraduationCap size={18} style={{ color: '#2E7D52', margin: '0 auto 8px' }} />
          <div className="stat-number">{profile?.phdScholars || '8'}</div>
          <div className="stat-label">PhD Scholars</div>
        </div>
      </div>

      {/* Two-column quick preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 28 }}>
        {/* Recent Publications */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.08)' }}>
          <div className="section-header" style={{ marginBottom: 14 }}>
            <h3 className="section-title" style={{ fontSize: 19 }}>
              <BookOpen size={17} style={{ color: '#B48C3C' }} /> Recent Publications
            </h3>
          </div>
          {recentPubs.map((pub, i) => (
            <div key={pub.id} style={{ padding: '11px 0', borderBottom: i < recentPubs.length - 1 ? '1px solid #F0EFEb' : 'none' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: 14, color: '#0A1F44', lineHeight: 1.35 }}>{pub.title}</div>
              <div style={{ fontSize: 12, color: '#A09890', marginTop: 4 }}>{pub.journal} · {pub.year}</div>
              <span className={`badge ${pub.type === 'Journal' ? 'badge-navy' : pub.type === 'Conference' ? 'badge-blue' : 'badge-green'}`} style={{ marginTop: 6 }}>{pub.type}</span>
            </div>
          ))}
        </div>

        {/* Recent Awards */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.08)' }}>
          <div className="section-header" style={{ marginBottom: 14 }}>
            <h3 className="section-title" style={{ fontSize: 19 }}>
              <Award size={17} style={{ color: '#B48C3C' }} /> Recent Awards
            </h3>
          </div>
          {recentAwards.map((award, i) => (
            <div key={award.id} style={{ padding: '11px 0', borderBottom: i < recentAwards.length - 1 ? '1px solid #F0EFEb' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #B48C3C, #F0C040)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>🏆</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0A1F44', lineHeight: 1.3 }}>{award.title}</div>
                <div style={{ fontSize: 12, color: '#A09890', marginTop: 3 }}>{award.body} · {award.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Summary */}
      {profile?.summary && (
        <div style={{ background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)', borderRadius: 16, padding: 28, marginBottom: 28, boxShadow: '0 6px 24px rgba(10,31,68,0.18)' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 21, color: '#D4AF37', marginBottom: 12 }}>Professional Summary</h3>
          <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, fontSize: 14 }}>{profile.summary}</p>
        </div>
      )}
    </div>
  );
}
