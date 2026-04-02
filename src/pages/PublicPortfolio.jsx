// src/pages/PublicPortfolio.jsx – Public read-only portfolio (no login required)
import { useEffect, useRef, useState } from 'react';
import { getProfile, getCollection } from '../firebase/services';
import { Mail, Phone, MapPin, ExternalLink, Link2, GraduationCap, ChevronRight, Settings } from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'about',       label: 'About' },
  { id: 'research',    label: 'Research' },
  { id: 'patents',     label: 'Patents' },
  { id: 'awards',      label: 'Awards' },
  { id: 'projects',    label: 'Projects' },
  { id: 'experience',  label: 'Experience' },
  { id: 'education',   label: 'Education' },
  { id: 'teaching',    label: 'Teaching' },
  { id: 'contact',     label: 'Contact' },
];

const TYPE_COLORS = {
  Journal:        { bg: '#E8EDF7', color: '#0A1F44' },
  Conference:     { bg: '#EBF0FB', color: '#2563eb' },
  'Book Chapter': { bg: '#EDFAF3', color: '#2E7D52' },
};

const PATENT_STATUS_COLOR = { Granted: '#2E7D52', Published: '#2563eb', Filed: '#B48C3C' };

export default function PublicPortfolio({ onAdminLogin }) {
  const [profile,      setProfile]      = useState(null);
  const [publications, setPublications] = useState([]);
  const [patents,      setPatents]      = useState([]);
  const [awards,       setAwards]       = useState([]);
  const [projects,     setProjects]     = useState([]);
  const [experience,   setExperience]   = useState([]);
  const [education,    setEducation]    = useState([]);
  const [teaching,     setTeaching]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [pubFilter,    setPubFilter]    = useState('All');
  const [navSticky,    setNavSticky]    = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getProfile(),
      getCollection('publications'),
      getCollection('patents'),
      getCollection('awards'),
      getCollection('projects'),
      getCollection('experience'),
      getCollection('education'),
      getCollection('teaching'),
    ]).then(([p, pubs, pats, aws, projs, exp, edu, teach]) => {
      setProfile(p);
      setPublications(pubs);
      setPatents(pats);
      setAwards(aws);
      setProjects(projs);
      setExperience(exp);
      setEducation(edu);
      setTeaching(teach);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavSticky(window.scrollY > (heroRef.current?.offsetHeight || 400));
      const offsets = NAV_SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        return el ? { id: s.id, top: el.getBoundingClientRect().top } : null;
      }).filter(Boolean);
      const visible = offsets.filter(o => o.top <= 100);
      if (visible.length) setActiveSection(visible[visible.length - 1].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#060E22' }}>
      <div className="spinner" />
    </div>
  );

  const filteredPubs = pubFilter === 'All' ? publications : publications.filter(p => p.type === pubFilter);
  const pubTypes = ['All', 'Journal', 'Conference', 'Book Chapter'];

  const buildUrl = (key, val) => {
    if (!val) return null;
    if (key === 'orcid') return `https://orcid.org/${val}`;
    if (key === 'scopusId') return `https://www.scopus.com/authid/detail.uri?authorId=${val}`;
    return `https://${val}`;
  };

  const profileLinks = [
    { key: 'linkedin',       label: 'LinkedIn',    color: '#0A66C2' },
    { key: 'googleScholar',  label: 'Scholar',     color: '#4285F4' },
    { key: 'orcid',          label: 'ORCID',       color: '#A6CE39' },
    { key: 'researchGate',   label: 'ResearchGate',color: '#00CCBB' },
    { key: 'scopusId',       label: 'Scopus',      color: '#E9711C' },
    { key: 'semanticScholar',label: 'Semantic Scholar', color: '#1857B6' },
  ].filter(l => profile?.[l.key]);

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#F8F7F4', minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ background: 'linear-gradient(160deg, #060E22 0%, #0A1F44 55%, #1E3A7A 100%)', padding: '60px 24px 56px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #B48C3C, #F0C040, #B48C3C)' }} />
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              {profile?.photoUrl
                ? <img src={profile.photoUrl} alt={profile?.name} style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '4px solid #D4AF37', boxShadow: '0 0 0 8px rgba(212,175,55,0.15)' }} />
                : (
                  <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '4px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap size={56} color="#D4AF37" />
                  </div>
                )
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 700, color: '#F0EDE6', lineHeight: 1.15, marginBottom: 6 }}>
                {profile?.name || 'Dr. Venkata Naga Rani Bandaru'}
              </div>
              <div style={{ fontSize: 16, color: '#D4AF37', fontWeight: 700, marginBottom: 4 }}>{profile?.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 18 }}>{profile?.department} · {profile?.institution}</div>

              {/* Contact row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginBottom: 18 }}>
                {profile?.email    && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(255,255,255,0.7)' }}><Mail size={13} color="#D4AF37" />{profile.email}</span>}
                {profile?.phone    && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(255,255,255,0.7)' }}><Phone size={13} color="#D4AF37" />{profile.phone}</span>}
                {profile?.location && <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(255,255,255,0.7)' }}><MapPin size={13} color="#D4AF37" />{profile.location}</span>}
              </div>

              {/* Profile links */}
              {profileLinks.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {profileLinks.map(({ key, label, color }) => (
                    <a key={key} href={buildUrl(key, profile[key])} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.08)', border:`1px solid ${color}55`, color, borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, textDecoration:'none', transition:'all 0.15s' }}>
                      <ExternalLink size={10} />{label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flexShrink: 0 }}>
              {[
                { n: profile?.experience || '18+', l: 'Yrs Experience' },
                { n: publications.length,           l: 'Publications' },
                { n: patents.length,                l: 'Patents' },
                { n: awards.length,                 l: 'Awards' },
                { n: projects.length,               l: 'Projects' },
                { n: profile?.phdScholars || '4',   l: 'PhD Scholars' },
              ].map(({ n, l }) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.07)', borderRadius:12, padding:'12px 16px', textAlign:'center', border:'1px solid rgba(212,175,55,0.2)' }}>
                  <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:26, fontWeight:700, color:'#D4AF37', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:4, lineHeight:1.2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY NAV ────────────────────────────────────────── */}
      <nav style={{
        position: navSticky ? 'fixed' : 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        background: navSticky ? '#0A1F44' : '#0A1F44',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
        boxShadow: navSticky ? '0 4px 20px rgba(0,0,0,0.35)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        <div style={{ maxWidth: 960, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:4, overflowX:'auto' }}>
          {NAV_SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              style={{
                padding:'14px 14px', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', background:'transparent', whiteSpace:'nowrap',
                color: activeSection === s.id ? '#D4AF37' : 'rgba(255,255,255,0.65)',
                borderBottom: activeSection === s.id ? '2px solid #D4AF37' : '2px solid transparent',
                transition:'all 0.15s',
              }}>
              {s.label}
            </button>
          ))}
          <div style={{ flex:1 }} />
          <button onClick={onAdminLogin}
            style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, border:'1px solid rgba(212,175,55,0.4)', background:'transparent', color:'#D4AF37', cursor:'pointer' }}>
            <Settings size={13} /> Admin
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin:'0 auto', padding:'0 24px 80px' }}>

        {/* ── ABOUT ─────────────────────────────────────────── */}
        <section id="about" style={{ paddingTop: 56 }}>
          <SectionHeading>About</SectionHeading>
          {profile?.summary && (
            <div style={{ background:'white', borderRadius:16, padding:28, marginBottom:24, boxShadow:'0 2px 12px rgba(10,31,68,0.07)', lineHeight:1.8, fontSize:14.5, color:'#2A2F3E' }}>
              {profile.summary}
            </div>
          )}
          {(profile?.specializations || []).length > 0 && (
            <div style={{ background:'linear-gradient(135deg,#0A1F44,#1E3A7A)', borderRadius:16, padding:24, boxShadow:'0 4px 16px rgba(10,31,68,0.15)' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:1, marginBottom:12 }}>RESEARCH SPECIALIZATIONS</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profile.specializations.map(s => (
                  <span key={s} style={{ background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.35)', color:'#D4AF37', borderRadius:20, padding:'6px 16px', fontSize:13, fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── RESEARCH PUBLICATIONS ─────────────────────────── */}
        <section id="research" style={{ paddingTop: 56 }}>
          <SectionHeading>Research Publications <span style={{ fontWeight:400, fontSize:16, color:'#A09890' }}>({publications.length})</span></SectionHeading>
          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
            {pubTypes.map(t => {
              const count = t === 'All' ? publications.length : publications.filter(p => p.type === t).length;
              return (
                <button key={t} onClick={() => setPubFilter(t)}
                  style={{
                    padding:'7px 18px', borderRadius:20, fontSize:13, fontWeight:700, cursor:'pointer', border:'1.5px solid',
                    borderColor: pubFilter === t ? '#0A1F44' : '#E2E0DC',
                    background: pubFilter === t ? '#0A1F44' : 'white',
                    color: pubFilter === t ? '#D4AF37' : '#6A6560',
                    transition:'all 0.15s',
                  }}>
                  {t} <span style={{ opacity:0.65, fontSize:11 }}>({count})</span>
                </button>
              );
            })}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {filteredPubs.map((pub, i) => (
              <div key={pub.id} style={{ background:'white', borderRadius:14, padding:'18px 22px', boxShadow:'0 2px 8px rgba(10,31,68,0.06)', display:'flex', gap:16, alignItems:'flex-start' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'#F4F3F0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'Cormorant Garamond, serif', fontSize:14, fontWeight:700, color:'#A09890' }}>
                  {i + 1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14.5, color:'#0A1F44', lineHeight:1.4, marginBottom:5 }}>{pub.title}</div>
                  <div style={{ fontSize:13, color:'#6A6560', fontStyle:'italic', marginBottom:6 }}>{pub.authors}</div>
                  <div style={{ fontSize:12.5, color:'#A09890', marginBottom:8 }}>{pub.journal} · {pub.year}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                    {pub.type && <span style={{ background: TYPE_COLORS[pub.type]?.bg, color: TYPE_COLORS[pub.type]?.color, borderRadius:8, padding:'2px 10px', fontSize:11, fontWeight:700 }}>{pub.type}</span>}
                    {pub.indexed && <span style={{ background:'#FFF8E7', color:'#B48C3C', borderRadius:8, padding:'2px 10px', fontSize:11, fontWeight:700 }}>{pub.indexed}</span>}
                    {pub.doi && (
                      <a href={pub.doi} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#2563eb', fontWeight:700, textDecoration:'none' }}>
                        <Link2 size={10} /> View Paper
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PATENTS ───────────────────────────────────────── */}
        {patents.length > 0 && (
          <section id="patents" style={{ paddingTop: 56 }}>
            <SectionHeading>Patents <span style={{ fontWeight:400, fontSize:16, color:'#A09890' }}>({patents.length})</span></SectionHeading>
            <div className="cards-grid">
              {patents.map(p => (
                <div key={p.id} style={{ background:'white', borderRadius:14, padding:22, boxShadow:'0 2px 8px rgba(10,31,68,0.06)', borderLeft:`4px solid ${PATENT_STATUS_COLOR[p.status] || '#B48C3C'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:700, color: PATENT_STATUS_COLOR[p.status] || '#B48C3C', background:(PATENT_STATUS_COLOR[p.status]||'#B48C3C')+'18', borderRadius:6, padding:'2px 10px' }}>{p.status}</span>
                    <span style={{ fontSize:11, color:'#A09890', fontWeight:600 }}>#{p.number} · {p.year}</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#0A1F44', lineHeight:1.4, marginBottom:8 }}>{p.title}</div>
                  {p.description && <div style={{ fontSize:12.5, color:'#6A6560', lineHeight:1.6 }}>{p.description}</div>}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:10, fontSize:12, color:'#2563eb', fontWeight:700, textDecoration:'none' }}><ExternalLink size={11} /> View Patent</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AWARDS ────────────────────────────────────────── */}
        {awards.length > 0 && (
          <section id="awards" style={{ paddingTop: 56 }}>
            <SectionHeading>Awards & Achievements <span style={{ fontWeight:400, fontSize:16, color:'#A09890' }}>({awards.length})</span></SectionHeading>
            <div className="cards-grid">
              {awards.map(a => (
                <div key={a.id} style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 8px rgba(10,31,68,0.06)', display:'flex', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'linear-gradient(135deg,#0A1F44,#1E3A7A)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>
                    {a.photoUrl ? <img src={a.photoUrl} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:12 }} /> : '🏆'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13.5, color:'#0A1F44', lineHeight:1.35, marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:12, color:'#B48C3C', fontWeight:700, marginBottom:6 }}>{a.body}</div>
                    <div style={{ display:'flex', gap:6 }}>
                      <span className="badge badge-navy">{a.year}</span>
                      <span className="badge badge-gold">{a.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ──────────────────────────────────────── */}
        {projects.length > 0 && (
          <section id="projects" style={{ paddingTop: 56 }}>
            <SectionHeading>Research Projects & Grants <span style={{ fontWeight:400, fontSize:16, color:'#A09890' }}>({projects.length})</span></SectionHeading>
            <div className="cards-grid">
              {projects.map(p => {
                const sc = { 'In Progress':'#B48C3C', 'Submitted':'#2563eb', 'Completed':'#2E7D52', 'Proposal Stage':'#7c3aed' };
                const c = sc[p.status] || '#0A1F44';
                return (
                  <div key={p.id} style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 8px rgba(10,31,68,0.06)', borderTop:`3px solid ${c}` }}>
                    <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                      <span style={{ background:c+'18', color:c, border:`1px solid ${c}44`, borderRadius:8, padding:'2px 10px', fontSize:11, fontWeight:700 }}>{p.status}</span>
                      {p.area && <span className="badge badge-navy">{p.area}</span>}
                    </div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#0A1F44', lineHeight:1.4, marginBottom:8 }}>{p.title}</div>
                    {p.funding && <div style={{ fontSize:12.5, color:'#2E7D52', fontWeight:700, marginBottom:4 }}>💰 {p.funding}{p.amount ? ` — ₹${p.amount} Lakhs` : ''}</div>}
                    {p.description && <div style={{ fontSize:12.5, color:'#6A6560', lineHeight:1.6 }}>{p.description}</div>}
                    {p.collaborators && <div style={{ fontSize:12, color:'#A09890', marginTop:8 }}>👥 {p.collaborators}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── EXPERIENCE ────────────────────────────────────── */}
        {experience.length > 0 && (
          <section id="experience" style={{ paddingTop: 56 }}>
            <SectionHeading>Professional Experience</SectionHeading>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:19, top:0, bottom:0, width:2, background:'linear-gradient(180deg,#D4AF37,rgba(212,175,55,0.1))', borderRadius:2 }} />
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ display:'flex', gap:20, marginBottom:24, paddingLeft:4 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background: exp.isCurrent ? 'linear-gradient(135deg,#B48C3C,#F0C040)' : '#F4F3F0', border:`2px solid ${exp.isCurrent ? '#D4AF37' : '#E2E0DC'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14 }}>
                    {exp.isCurrent ? '⭐' : '📌'}
                  </div>
                  <div style={{ flex:1, background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 8px rgba(10,31,68,0.06)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:4, marginBottom:4 }}>
                      <div style={{ fontWeight:700, fontSize:14.5, color:'#0A1F44' }}>{exp.role}</div>
                      <div style={{ fontSize:12, color:'#B48C3C', fontWeight:700 }}>{exp.period}</div>
                    </div>
                    <div style={{ fontSize:13, color:'#6A6560', marginBottom:exp.description ? 10 : 0 }}>{exp.institution}</div>
                    {exp.description && <div style={{ fontSize:13, color:'#7A7570', lineHeight:1.65 }}>{exp.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EDUCATION ─────────────────────────────────────── */}
        {education.length > 0 && (
          <section id="education" style={{ paddingTop: 56 }}>
            <SectionHeading>Education</SectionHeading>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {education.map(edu => (
                <div key={edu.id} style={{ background:'white', borderRadius:14, padding:'20px 24px', boxShadow:'0 2px 8px rgba(10,31,68,0.06)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:19, fontWeight:700, color:'#0A1F44', marginBottom:4 }}>{edu.degree}</div>
                    <div style={{ fontSize:13.5, color:'#6A6560', marginBottom:6 }}>{edu.institution}</div>
                    {edu.description && <div style={{ fontSize:13, color:'#A09890', lineHeight:1.6 }}>{edu.description}</div>}
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'#B48C3C' }}>{edu.year}</div>
                    {edu.grade && <div style={{ fontSize:12, color:'#6A6560', marginTop:4 }}>{edu.grade}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TEACHING ──────────────────────────────────────── */}
        {teaching.length > 0 && (
          <section id="teaching" style={{ paddingTop: 56 }}>
            <SectionHeading>Teaching & Courses</SectionHeading>
            <div className="cards-grid">
              {teaching.map(t => (
                <div key={t.id} style={{ background:'white', borderRadius:14, padding:18, boxShadow:'0 2px 8px rgba(10,31,68,0.06)' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#0A1F44', marginBottom:8 }}>{t.course}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                    {t.code     && <span style={{ fontSize:11, fontWeight:700, background:'#F4F3F0', color:'#6A6560', borderRadius:6, padding:'2px 8px' }}>{t.code}</span>}
                    {t.level    && <span className="badge badge-navy" style={{ fontSize:11 }}>{t.level}</span>}
                    {t.semester && <span className="badge badge-gold" style={{ fontSize:11 }}>{t.semester} Sem</span>}
                    {t.year     && <span style={{ fontSize:11, color:'#A09890', fontWeight:600 }}>{t.year}</span>}
                  </div>
                  {t.description && <div style={{ fontSize:12.5, color:'#7A7570', lineHeight:1.6 }}>{t.description}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ───────────────────────────────────────── */}
        <section id="contact" style={{ paddingTop: 56 }}>
          <div style={{ background:'linear-gradient(135deg,#0A1F44,#1E3A7A)', borderRadius:20, padding:'40px 36px', textAlign:'center', boxShadow:'0 8px 32px rgba(10,31,68,0.18)' }}>
            <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:28, color:'#D4AF37', marginBottom:6 }}>Get in Touch</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:14, marginBottom:28 }}>Open to research collaborations, PhD supervision, and academic discussions.</div>
            <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'8px 28px', marginBottom:32 }}>
              {profile?.email    && <a href={`mailto:${profile.email}`} style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.8)', fontSize:14, textDecoration:'none' }}><Mail size={15} color="#D4AF37" />{profile.email}</a>}
              {profile?.phone    && <span style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.8)', fontSize:14 }}><Phone size={15} color="#D4AF37" />{profile.phone}</span>}
              {profile?.location && <span style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.8)', fontSize:14 }}><MapPin size={15} color="#D4AF37" />{profile.location}</span>}
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
              {profileLinks.map(({ key, label, color }) => (
                <a key={key} href={buildUrl(key, profile[key])} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.08)', border:`1px solid ${color}55`, color, borderRadius:20, padding:'7px 16px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                  <ExternalLink size={10} />{label}
                </a>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ background:'#060E22', borderTop:'1px solid rgba(212,175,55,0.15)', padding:'20px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} {profile?.name || 'Dr. Venkata Naga Rani Bandaru'} · Academic Portfolio
          </div>
          <button onClick={onAdminLogin}
            style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(255,255,255,0.3)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
            <Settings size={11} /> Portfolio Admin
          </button>
        </div>
      </footer>

    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:28, fontWeight:700, color:'#0A1F44', marginBottom:6 }}>{children}</h2>
      <div style={{ width:48, height:3, background:'linear-gradient(90deg,#B48C3C,#F0C040)', borderRadius:2 }} />
    </div>
  );
}
