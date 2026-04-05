// src/components/Sidebar.jsx
import {
  LayoutDashboard, User, BookOpen, Shield, Trophy,
  FlaskConical, Briefcase, Image, LogOut, GraduationCap,
  BarChart2, BookMarked, Users, Mic2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const nav = [
  { key: 'dashboard',    label: 'Dashboard',         icon: LayoutDashboard, section: 'Main' },
  { key: 'insights',     label: 'Insights',           icon: BarChart2,       section: 'Main' },
  { key: 'profile',      label: 'Profile & Bio',      icon: User,            section: 'Main' },
  { key: 'experience',   label: 'Experience',         icon: Briefcase,       section: 'Academic' },
  { key: 'education',    label: 'Education',          icon: GraduationCap,   section: 'Academic' },
  { key: 'teaching',     label: 'Teaching & Courses', icon: BookMarked,      section: 'Academic' },
  { key: 'publications', label: 'Publications',       icon: BookOpen,        section: 'Academic' },
  { key: 'patents',      label: 'Patents',            icon: Shield,          section: 'Academic' },
  { key: 'awards',       label: 'Awards',             icon: Trophy,          section: 'Academic' },
  { key: 'projects',        label: 'Research Projects',      icon: FlaskConical, section: 'Academic' },
  { key: 'collaborations',  label: 'Collaborations',         icon: Users,       section: 'Academic' },
  { key: 'sessionChair',    label: 'Session Chair',          icon: Mic2,        section: 'Academic' },
  { key: 'gallery',         label: 'Photo Gallery',          icon: Image,       section: 'Media' },
];

const sections = ['Main', 'Academic', 'Media'];

export default function Sidebar({ activePage, setActivePage }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #B48C3C, #F0C040)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <GraduationCap size={19} color="#0A1F44" />
          </div>
          <div>
            <div className="sidebar-logo-text">Dr. Rani</div>
            <div className="sidebar-logo-sub">Academic Portfolio</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => {
          const items = nav.filter(n => n.section === section);
          return (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`nav-item ${activePage === key ? 'active' : ''}`}
                  onClick={() => setActivePage(key)}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={handleLogout} style={{ color: '#f87171' }}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
