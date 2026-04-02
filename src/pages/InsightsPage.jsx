// src/pages/InsightsPage.jsx
import { useEffect, useState } from 'react';
import { getProfile, getCollection } from '../firebase/services';
import { BookOpen, Shield, Award, FlaskConical, TrendingUp, Star } from 'lucide-react';

export default function InsightsPage() {
  const [profile, setProfile] = useState(null);
  const [publications, setPublications] = useState([]);
  const [awards, setAwards] = useState([]);
  const [patents, setPatents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile(),
      getCollection('publications'),
      getCollection('awards'),
      getCollection('patents'),
      getCollection('projects'),
    ]).then(([p, pubs, aws, pats, projs]) => {
      setProfile(p);
      setPublications(pubs);
      setAwards(aws);
      setPatents(pats);
      setProjects(projs);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  // ── Computed stats ────────────────────────────────────────────
  const totalFunding = projects.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  // Publications by year
  const pubsByYear = {};
  publications.forEach(p => {
    const y = String(p.year || 'Unknown');
    pubsByYear[y] = (pubsByYear[y] || []);
    pubsByYear[y].push(p);
  });
  const pubYears = Object.keys(pubsByYear).filter(y => y !== 'Unknown').sort((a, b) => b - a);
  const maxPubCount = Math.max(...pubYears.map(y => pubsByYear[y].length), 1);

  // Publications by type
  const typeCount = { Journal: 0, Conference: 0, 'Book Chapter': 0 };
  publications.forEach(p => { if (typeCount[p.type] !== undefined) typeCount[p.type]++; });
  const totalPubs = publications.length || 1;

  // Activity timeline: merge all items by year
  const allItems = [
    ...publications.map(p => ({ year: String(p.year || ''), title: p.title, kind: 'pub', type: p.type })),
    ...awards.map(a => ({ year: String(a.year || ''), title: a.title, kind: 'award' })),
    ...patents.map(p => ({ year: String(p.year || ''), title: p.title, kind: 'patent' })),
    ...projects.map(p => ({ year: String(p.year || ''), title: p.title, kind: 'project', status: p.status })),
  ].filter(i => i.year && i.year !== 'undefined');

  const timelineYears = [...new Set(allItems.map(i => i.year))].filter(Boolean).sort((a, b) => b - a);

  // Awards by category
  const catCount = {};
  awards.forEach(a => { const c = a.category || 'Other'; catCount[c] = (catCount[c] || 0) + 1; });
  const catEntries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(([, v]) => v), 1);

  const kindIcon = { pub: '📄', award: '🏆', patent: '🔬', project: '📁' };
  const kindLabel = { pub: 'Publication', award: 'Award', patent: 'Patent', project: 'Project' };

  const typeColors = {
    Journal: { bg: '#E8EDF7', color: '#0A1F44' },
    Conference: { bg: '#EBF0FB', color: '#2563eb' },
    'Book Chapter': { bg: '#EDFAF3', color: '#2E7D52' },
  };

  return (
    <div style={{ maxWidth: 960 }}>

      {/* ── A. Summary Stats ─────────────────────────────────── */}
      <div className="stats-row" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <BookOpen size={18} style={{ color: '#B48C3C', margin: '0 auto 8px' }} />
          <div className="stat-number">{publications.length}</div>
          <div className="stat-label">Publications</div>
        </div>
        <div className="stat-card">
          <Shield size={18} style={{ color: '#2563eb', margin: '0 auto 8px' }} />
          <div className="stat-number">{patents.length}</div>
          <div className="stat-label">Patents</div>
        </div>
        <div className="stat-card">
          <Award size={18} style={{ color: '#B48C3C', margin: '0 auto 8px' }} />
          <div className="stat-number">{awards.length}</div>
          <div className="stat-label">Awards</div>
        </div>
        <div className="stat-card">
          <FlaskConical size={18} style={{ color: '#7c3aed', margin: '0 auto 8px' }} />
          <div className="stat-number">{projects.length}</div>
          <div className="stat-label">Projects</div>
        </div>
        {totalFunding > 0 && (
          <div className="stat-card">
            <TrendingUp size={18} style={{ color: '#2E7D52', margin: '0 auto 8px' }} />
            <div className="stat-number">₹{totalFunding}</div>
            <div className="stat-label">Lakhs Funding</div>
          </div>
        )}
      </div>

      {/* ── B. Research Metrics (Citations + h-index) ─────────── */}
      {(profile?.citations || profile?.hIndex) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
          {profile?.citations && (
            <div style={{ background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 4px 16px rgba(10,31,68,0.18)' }}>
              <Star size={22} style={{ color: '#D4AF37', marginBottom: 10 }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 700, color: '#D4AF37', lineHeight: 1 }}>{profile.citations}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8, letterSpacing: 1 }}>TOTAL CITATIONS</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>Update manually from Google Scholar</div>
            </div>
          )}
          {profile?.hIndex && (
            <div style={{ background: 'linear-gradient(135deg, #2E7D52, #1a5c38)', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 4px 16px rgba(46,125,82,0.18)' }}>
              <TrendingUp size={22} style={{ color: '#90EEB3', marginBottom: 10 }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 700, color: '#90EEB3', lineHeight: 1 }}>{profile.hIndex}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8, letterSpacing: 1 }}>h-INDEX</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>Update manually from Google Scholar</div>
            </div>
          )}
        </div>
      )}

      {/* ── C. Publications by Year (bar chart) ───────────────── */}
      <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.08)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 20 }}>
          <BookOpen size={17} style={{ color: '#B48C3C', marginRight: 8, verticalAlign: 'middle' }} />
          Publications by Year
        </h3>
        {pubYears.map(year => {
          const items = pubsByYear[year];
          const pct = (items.length / maxPubCount) * 100;
          const dominant = ['Journal', 'Conference', 'Book Chapter'].reduce((a, b) =>
            (items.filter(p => p.type === b).length > items.filter(p => p.type === a).length ? b : a), 'Journal');
          const barColor = dominant === 'Journal' ? '#0A1F44' : dominant === 'Conference' ? '#2563eb' : '#2E7D52';
          return (
            <div key={year} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 40, fontSize: 13, fontWeight: 700, color: '#0A1F44', flexShrink: 0, textAlign: 'right' }}>{year}</div>
              <div style={{ flex: 1, background: '#F4F3F0', borderRadius: 6, height: 26, overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%', background: barColor,
                  borderRadius: 6, transition: 'width 0.6s ease',
                  display: 'flex', alignItems: 'center', paddingLeft: 8,
                }}>
                  {pct > 20 && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{items.length}</span>}
                </div>
              </div>
              <div style={{ width: 24, fontSize: 13, fontWeight: 700, color: '#6A6560', flexShrink: 0 }}>
                {pct <= 20 ? items.length : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── D. Publications by Type ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {Object.entries(typeCount).map(([type, count]) => {
          const pct = Math.round((count / totalPubs) * 100);
          const { bg, color } = typeColors[type];
          return (
            <div key={type} style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 8px rgba(10,31,68,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 10 }}>{type}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 38, fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 12, color: '#A09890', marginTop: 4 }}>{pct}% of total</div>
              <div style={{ marginTop: 14, background: '#F4F3F0', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── E. Activity Timeline by Year ──────────────────────── */}
      <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.08)' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 20 }}>
          📅 Academic Activity by Year
        </h3>
        {timelineYears.length === 0 && <div style={{ color: '#A09890', fontSize: 13 }}>No dated items found.</div>}
        {timelineYears.map(year => {
          const yearItems = allItems.filter(i => i.year === year);
          return (
            <div key={year} style={{ marginBottom: 22 }}>
              <div style={{
                display: 'inline-block', background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)',
                color: '#D4AF37', borderRadius: 8, padding: '4px 14px',
                fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700,
                marginBottom: 10,
              }}>
                {year}
              </div>
              <div style={{ borderLeft: '2px solid #E2E0DC', paddingLeft: 16 }}>
                {yearItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{kindIcon[item.kind]}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1F44', lineHeight: 1.35 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#A09890', marginTop: 2 }}>
                        {kindLabel[item.kind]}
                        {item.type && <span style={{ marginLeft: 6, background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '1px 7px', borderRadius: 8, fontWeight: 700 }}>{item.type}</span>}
                        {item.status && <span style={{ marginLeft: 6, color: '#7c3aed', fontWeight: 600 }}>{item.status}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── F. Awards by Category ─────────────────────────────── */}
      {catEntries.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(10,31,68,0.08)' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#0A1F44', marginBottom: 20 }}>
            <Award size={17} style={{ color: '#B48C3C', marginRight: 8, verticalAlign: 'middle' }} />
            Awards by Category
          </h3>
          {catEntries.map(([cat, count]) => {
            const pct = (count / maxCat) * 100;
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 110, fontSize: 13, fontWeight: 600, color: '#0A1F44', flexShrink: 0 }}>{cat}</div>
                <div style={{ flex: 1, background: '#F4F3F0', borderRadius: 6, height: 24, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: 'linear-gradient(90deg, #B48C3C, #F0C040)',
                    borderRadius: 6, transition: 'width 0.6s ease',
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                  }}>
                    {pct > 20 && <span style={{ color: '#0A1F44', fontSize: 11, fontWeight: 700 }}>{count}</span>}
                  </div>
                </div>
                <div style={{ width: 20, fontSize: 13, fontWeight: 700, color: '#6A6560', flexShrink: 0 }}>
                  {pct <= 20 ? count : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── G. Research Focus Tags ────────────────────────────── */}
      {(profile?.specializations || []).length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #0A1F44, #1E3A7A)', borderRadius: 16, padding: 28, boxShadow: '0 6px 24px rgba(10,31,68,0.18)' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#D4AF37', marginBottom: 16 }}>
            Research Focus Areas
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {(profile.specializations || []).map(s => (
              <span key={s} style={{
                background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                color: '#D4AF37', padding: '8px 18px', borderRadius: 24,
                fontSize: 13, fontWeight: 600,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
