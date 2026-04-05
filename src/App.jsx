// src/App.jsx
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import PublicationsPage from './pages/PublicationsPage';
import PatentsPage from './pages/PatentsPage';
import AwardsPage from './pages/AwardsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import GalleryPage from './pages/GalleryPage';
import InsightsPage from './pages/InsightsPage';
import TeachingPage from './pages/TeachingPage';
import CollaborationsPage from './pages/CollaborationsPage';
import SessionChairPage from './pages/SessionChairPage';
import LoginPage from './pages/LoginPage';
import PublicPortfolio from './pages/PublicPortfolio';
import { seedInitialData } from './firebase/services';

const PAGES = {
  dashboard:    Dashboard,
  profile:      ProfilePage,
  publications: PublicationsPage,
  patents:      PatentsPage,
  awards:       AwardsPage,
  projects:     ProjectsPage,
  experience:   ExperiencePage,
  education:    EducationPage,
  gallery:      GalleryPage,
  insights:        InsightsPage,
  teaching:        TeachingPage,
  collaborations:  CollaborationsPage,
  sessionChair:    SessionChairPage,
};

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  profile:      'Edit Profile',
  publications: 'Research Publications',
  patents:      'Patents',
  awards:       'Awards & Achievements',
  projects:     'Research Projects & Grants',
  experience:   'Professional Experience',
  education:    'Education & Qualifications',
  gallery:      'Photo Gallery',
  insights:     'Insights & Activity',
  teaching:     'Teaching & Courses',
};

function AppInner() {
  const { user, loading, authError } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [seeded, setSeeded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (user && !seeded) {
      seedInitialData()
        .then(() => setSeeded(true))
        .catch(console.error);
    }
  }, [user, seeded]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#060E22' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#060E22', padding: 24 }}>
        <div style={{ background: '#0A1F44', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 14, padding: '32px 36px', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F0C040', fontSize: 22, marginBottom: 12 }}>Supabase Connection Error</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{authError}</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px', textAlign: 'left', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.9 }}>
            <strong style={{ color: '#F0C040' }}>Checklist:</strong><br />
            1. Create a project at <strong style={{ color: 'white' }}>supabase.com</strong><br />
            2. Add <strong style={{ color: 'white' }}>VITE_SUPABASE_URL</strong> and <strong style={{ color: 'white' }}>VITE_SUPABASE_ANON_KEY</strong> to your <strong style={{ color: 'white' }}>.env</strong> file<br />
            3. Supabase Dashboard → Authentication → Users → <strong style={{ color: 'white' }}>Add user</strong><br />
            4. Supabase Dashboard → Storage → <strong style={{ color: 'white' }}>Create bucket</strong> named <strong style={{ color: 'white' }}>portfolio-media</strong>
          </div>
          <button className="btn btn-gold" style={{ marginTop: 20 }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) return <LoginPage onCancel={() => setShowLogin(false)} />;
    return <PublicPortfolio onAdminLogin={() => setShowLogin(true)} />;
  }

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Topbar title={PAGE_TITLES[activePage]} />
        <div className="page-content">
          <PageComponent />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A1F44',
            color: '#F0C040',
            border: '1px solid rgba(180,140,60,0.4)',
            borderRadius: '8px',
            fontFamily: 'Nunito Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#D4AF37', secondary: '#0A1F44' } },
        }}
      />
      <AppInner />
    </AuthProvider>
  );
}
