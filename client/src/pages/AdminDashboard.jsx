import { useState, useEffect } from 'react';
import axios from 'axios';
import InternshipApplications from '../components/admin/InternshipApplications';
import ManageServices from '../components/admin/ManageServices';
import ManagePricing from '../components/admin/ManagePricing';
import ManageProjects from '../components/admin/ManageProjects';
import ManageFeedback from '../components/admin/ManageFeedback';
import ManageConsultations from '../components/admin/ManageConsultations';
import ManageContact from '../components/admin/ManageContact';
import ManageCareers from '../components/admin/ManageCareers';

// SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ServicesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PricingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </svg>
);

const ConsultationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01" />
    <path d="M12 10h.01" />
    <path d="M16 10h.01" />
  </svg>
);

const ContactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
    <path d="M8 9h8" />
    <path d="M8 13h6" />
  </svg>
);

const CareerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="13" r="2" />
    <path d="M18 19H6v-2a4 4 0 0 1 8 0v2" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default function AdminDashboard({ dark, C }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    visitors: 0,
    applications: 0,
    pendingApplications: 0,
    totalProjects: 0,
    totalServices: 0,
    totalFeedback: 0,
    pendingFeedback: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    totalContact: 0,
    pendingContact: 0,
    totalCareers: 0,
    pendingCareers: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    // Get admin name from localStorage if set
    const name = localStorage.getItem('adminName');
    if (name) setAdminName(name);
  }, []);

  const fetchStats = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: {
          'admin-key': 'coding-world-admin-2025'
        }
      });
      // Ensure all stats have default values
      const data = response.data.data || {};
      setStats({
        visitors: data.visitors || 0,
        applications: data.applications || 0,
        pendingApplications: data.pendingApplications || 0,
        totalProjects: data.totalProjects || 0,
        totalServices: data.totalServices || 0,
        totalFeedback: data.totalFeedback || 0,
        pendingFeedback: data.pendingFeedback || 0,
        totalConsultations: data.totalConsultations || 0,
        pendingConsultations: data.pendingConsultations || 0,
        totalContact: data.totalContact || 0,
        pendingContact: data.pendingContact || 0,
        totalCareers: data.totalCareers || 0,
        pendingCareers: data.pendingCareers || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminKey');
    window.location.href = '/admin/login';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, color: '#00e5ff' },
    { id: 'applications', label: 'Internships', icon: <ApplicationsIcon />, color: '#bf5fff' },
    { id: 'feedback', label: 'Feedback', icon: <FeedbackIcon />, color: '#ff9d00' },
    { id: 'consultations', label: 'Consultations', icon: <ConsultationIcon />, color: '#25d366' },
    { id: 'contact', label: 'Contact', icon: <ContactIcon />, color: '#ff6b6b' },
    { id: 'careers', label: 'Careers', icon: <CareerIcon />, color: '#00ffb3' },
    { id: 'services', label: 'Services', icon: <ServicesIcon />, color: '#ffd700' },
    { id: 'pricing', label: 'Pricing', icon: <PricingIcon />, color: '#ff9d00' },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon />, color: '#00e5ff' }
  ];

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '100px 5% 50px', 
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 50,
            height: 50,
            border: '3px solid #00e5ff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: C.muted }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '100px 5% 50px', 
      minHeight: '100vh',
      background: C.bg
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 30,
          flexWrap: 'wrap',
          gap: 15
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <h1 style={{ 
                fontSize: 28, 
                fontWeight: 800, 
                color: C.text, 
                marginBottom: 5,
                background: 'linear-gradient(135deg, #00e5ff, #bf5fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Admin Dashboard
              </h1>
              <button
                onClick={fetchStats}
                disabled={refreshing}
                style={{
                  background: 'none',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '6px 10px',
                  color: C.muted,
                  cursor: refreshing ? 'default' : 'pointer',
                  animation: refreshing ? 'spin 1s linear infinite' : 'none'
                }}
              >
                <RefreshIcon />
              </button>
            </div>
            <p style={{ color: C.muted, fontSize: 14 }}>
              Welcome back, <span style={{ color: '#00e5ff', fontWeight: 600 }}>{adminName}</span>! Manage your website content and view applications.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: '8px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#25d366',
                animation: 'pulse 2s ease infinite'
              }} />
              <span style={{ color: C.text, fontSize: 13 }}>Online</span>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '8px 16px',
                color: '#ff6b6b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ff6b6b20';
                e.currentTarget.style.borderColor = '#ff6b6b';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#ff6b6b20',
            border: '1px solid #ff6b6b44',
            borderRadius: 10,
            padding: '15px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#ff6b6b' }}>{error}</span>
            <button
              onClick={fetchStats}
              style={{
                background: '#ff6b6b',
                border: 'none',
                borderRadius: 6,
                padding: '5px 12px',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {activeTab === 'dashboard' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 20,
            marginBottom: 30
          }}>
            <StatCard
              title="Total Visitors"
              value={stats.visitors}
              icon="👁️"
              color="#00e5ff"
              dark={dark}
              C={C}
              trend="+12%"
            />
            <StatCard
              title="Internships"
              value={stats.applications}
              icon="📝"
              color="#bf5fff"
              dark={dark}
              C={C}
              subValue={`${stats.pendingApplications} pending`}
            />
            <StatCard
              title="Feedback"
              value={stats.totalFeedback}
              icon="💬"
              color="#ff9d00"
              dark={dark}
              C={C}
              subValue={`${stats.pendingFeedback} pending`}
            />
            <StatCard
              title="Consultations"
              value={stats.totalConsultations}
              icon="📞"
              color="#25d366"
              dark={dark}
              C={C}
              subValue={`${stats.pendingConsultations} pending`}
            />
            <StatCard
              title="Contact"
              value={stats.totalContact}
              icon="✉️"
              color="#ff6b6b"
              dark={dark}
              C={C}
              subValue={`${stats.pendingContact} pending`}
            />
            <StatCard
              title="Careers"
              value={stats.totalCareers}
              icon="💼"
              color="#00ffb3"
              dark={dark}
              C={C}
              subValue={`${stats.pendingCareers} pending`}
            />
            <StatCard
              title="Projects"
              value={stats.totalProjects}
              icon="🚀"
              color="#ffd700"
              dark={dark}
              C={C}
            />
            <StatCard
              title="Services"
              value={stats.totalServices}
              icon="⚡"
              color="#00e5ff"
              dark={dark}
              C={C}
            />
          </div>
        )}

        {/* Quick Actions */}
        {activeTab === 'dashboard' && (
          <div style={{ marginBottom: 30 }}>
            <h3 style={{ color: C.text, fontSize: 16, marginBottom: 15 }}>Quick Actions</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 15
            }}>
              <QuickActionCard
                icon="📋"
                title="Internships"
                desc="Review internship applications"
                onClick={() => setActiveTab('applications')}
                color="#00e5ff"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="💬"
                title="Feedback"
                desc="Moderate user feedback"
                onClick={() => setActiveTab('feedback')}
                color="#bf5fff"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="📞"
                title="Consultations"
                desc="Manage consultation requests"
                onClick={() => setActiveTab('consultations')}
                color="#25d366"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="✉️"
                title="Contact"
                desc="Reply to contact messages"
                onClick={() => setActiveTab('contact')}
                color="#ff6b6b"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="💼"
                title="Careers"
                desc="Review job applications"
                onClick={() => setActiveTab('careers')}
                color="#00ffb3"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="📁"
                title="Projects"
                desc="Add/edit projects"
                onClick={() => setActiveTab('projects')}
                color="#ffd700"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="⚡"
                title="Services"
                desc="Update services"
                onClick={() => setActiveTab('services')}
                color="#ff9d00"
                dark={dark}
                C={C}
              />
              <QuickActionCard
                icon="💰"
                title="Pricing"
                desc="Manage pricing plans"
                onClick={() => setActiveTab('pricing')}
                color="#00e5ff"
                dark={dark}
                C={C}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 5,
          borderBottom: `2px solid ${C.border}`,
          marginBottom: 30,
          overflowX: 'auto',
          paddingBottom: 2,
          scrollbarWidth: 'none'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                color: activeTab === tab.id ? tab.color : C.muted,
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ color: activeTab === tab.id ? tab.color : C.muted }}>
                {tab.icon}
              </span>
              {tab.label}
              {tab.id === 'applications' && stats.pendingApplications > 0 && (
                <span style={{
                  background: '#ff6b6b',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 5
                }}>
                  {stats.pendingApplications}
                </span>
              )}
              {tab.id === 'feedback' && stats.pendingFeedback > 0 && (
                <span style={{
                  background: '#ff9d00',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 5
                }}>
                  {stats.pendingFeedback}
                </span>
              )}
              {tab.id === 'consultations' && stats.pendingConsultations > 0 && (
                <span style={{
                  background: '#25d366',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 5
                }}>
                  {stats.pendingConsultations}
                </span>
              )}
              {tab.id === 'contact' && stats.pendingContact > 0 && (
                <span style={{
                  background: '#ff6b6b',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 5
                }}>
                  {stats.pendingContact}
                </span>
              )}
              {tab.id === 'careers' && stats.pendingCareers > 0 && (
                <span style={{
                  background: '#00ffb3',
                  color: '#07071a',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 5
                }}>
                  {stats.pendingCareers}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 25,
          minHeight: 500
        }}>
          {activeTab === 'applications' && <InternshipApplications dark={dark} C={C} />}
          {activeTab === 'feedback' && <ManageFeedback dark={dark} C={C} />}
          {activeTab === 'consultations' && <ManageConsultations dark={dark} C={C} />}
          {activeTab === 'contact' && <ManageContact dark={dark} C={C} />}
          {activeTab === 'careers' && <ManageCareers dark={dark} C={C} />}
          {activeTab === 'services' && <ManageServices dark={dark} C={C} />}
          {activeTab === 'pricing' && <ManagePricing dark={dark} C={C} />}
          {activeTab === 'projects' && <ManageProjects dark={dark} C={C} />}
          
          {activeTab === 'dashboard' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00e5ff20, #bf5fff20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                marginBottom: 20
              }}>
                👋
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 10 }}>
                Welcome to Admin Dashboard
              </h2>
              <p style={{ color: C.muted, maxWidth: 600, marginBottom: 30, lineHeight: 1.8 }}>
                Use the tabs above to manage internships, feedback, consultations, contact messages, 
                career applications, services, pricing, and projects. You can view applications, 
                approve feedback, respond to messages, update content, and more.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 20,
                maxWidth: 800,
                margin: '0 auto'
              }}>
                <QuickTip
                  icon="🕒"
                  title="Last Login"
                  value={new Date().toLocaleDateString()}
                  color="#00e5ff"
                />
                <QuickTip
                  icon="📊"
                  title="Total Items"
                  value={(stats.totalServices || 0) + (stats.totalProjects || 0) + (stats.applications || 0) + (stats.totalFeedback || 0) + (stats.totalConsultations || 0) + (stats.totalContact || 0) + (stats.totalCareers || 0)}
                  color="#bf5fff"
                />
                <QuickTip
                  icon="⏳"
                  title="Pending Actions"
                  value={(stats.pendingApplications || 0) + (stats.pendingFeedback || 0) + (stats.pendingConsultations || 0) + (stats.pendingContact || 0) + (stats.pendingCareers || 0)}
                  color="#ff9d00"
                />
                <QuickTip
                  icon="⚡"
                  title="Server Status"
                  value="Online"
                  color="#25d366"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value = 0, icon, color, dark, C, trend, subValue }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 20,
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = `0 12px 40px ${color}20`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{
        position: 'absolute',
        top: -10,
        right: -10,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: `${color}10`,
        zIndex: 0
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: color
          }}>
            {icon}
          </div>
          {trend && (
            <span style={{
              background: '#00ffb320',
              color: '#00ffb3',
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 20
            }}>
              {trend}
            </span>
          )}
        </div>
        
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 5 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div style={{ color: C.muted, fontSize: 13 }}>{title}</div>
          {subValue && (
            <div style={{ color, fontSize: 12, marginTop: 5 }}>{subValue}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, desc, onClick, color, dark, C }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginBottom: 12,
        color: color
      }}>
        {icon}
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</h4>
      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}

// Quick Tip Component
function QuickTip({ icon, title, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 5 }}>{icon}</div>
      <div style={{ fontSize: 12, color: '#7878a8', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}