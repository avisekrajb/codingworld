import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CareersPopup from '../components/CareersPopup';

const JobCard = ({ job, onApply, dark, C }) => {
  const [expanded, setExpanded] = useState(false);

  const getIcon = (title) => {
    if (title.includes('Node.js')) return '🟢';
    if (title.includes('React')) return '⚛️';
    if (title.includes('Python')) return '🐍';
    if (title.includes('UI/UX')) return '🎨';
    if (title.includes('DevOps')) return '☁️';
    return '💼';
  };

  const getColor = (title) => {
    if (title.includes('Node.js')) return '#00e5ff';
    if (title.includes('React')) return '#bf5fff';
    if (title.includes('Python')) return '#00ffb3';
    if (title.includes('UI/UX')) return '#ff9d00';
    if (title.includes('DevOps')) return '#ff6b6b';
    return '#25d366';
  };

  const color = getColor(job.title);

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: 24,
        transition: 'all 0.3s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 20px 40px ${color}20`;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${color}44`;
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Background Icon */}
      <div style={{
        position: 'absolute',
        right: -10,
        bottom: -10,
        fontSize: 80,
        opacity: 0.05,
        transform: 'rotate(-10deg)',
        pointerEvents: 'none'
      }}>
        {getIcon(job.title)}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}>
            {getIcon(job.title)}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>
              {job.title}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: `${color}15`,
                color: color,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600
              }}>
                {job.type}
              </span>
              <span style={{
                background: `${color}15`,
                color: color,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600
              }}>
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 15 }}>
          {expanded ? job.description : `${job.description.substring(0, 120)}...`}
        </p>

        {/* Requirements - Show only when expanded */}
        {expanded && (
          <div style={{
            marginBottom: 20,
            animation: 'fadeIn 0.3s ease'
          }}>
            <h4 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              Requirements:
            </h4>
            <ul style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>

            <h4 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: '15px 0 8px' }}>
              Benefits:
            </h4>
            <ul style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
              {job.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: expanded ? 20 : 0,
          borderTop: expanded ? `1px solid ${C.border}` : 'none',
          paddingTop: expanded ? 20 : 0
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>
              {job.salary}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>per year</div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              style={{
                background: 'transparent',
                border: `1px solid ${color}44`,
                borderRadius: 8,
                padding: '8px 16px',
                color: color,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(job);
              }}
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                border: 'none',
                borderRadius: 8,
                padding: '8px 20px',
                color: '#07071a',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default function CareersPage({ dark, C }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    remote: 0,
    fulltime: 0
  });

  useEffect(() => {
    // Simulated job data - in production, fetch from API
    const jobData = [
      {
        id: 1,
        title: 'Senior Node.js Developer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$80k - $120k',
        description: 'We are looking for an experienced Node.js developer to join our backend team. You will be responsible for building scalable APIs, microservices, and real-time applications.',
        requirements: [
          '5+ years of Node.js experience',
          'Strong knowledge of Express.js',
          'Experience with MongoDB and PostgreSQL',
          'Understanding of microservices architecture',
          'Familiarity with Docker and Kubernetes'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Health insurance',
          'Stock options',
          'Flexible hours'
        ],
        department: 'Engineering',
        posted: '2 days ago'
      },
      {
        id: 2,
        title: 'React Frontend Developer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$70k - $100k',
        description: 'Join our frontend team to build beautiful and responsive user interfaces using React and modern web technologies.',
        requirements: [
          '3+ years of React experience',
          'Strong TypeScript skills',
          'Experience with Next.js',
          'Knowledge of state management (Redux/Zustand)',
          'Understanding of responsive design'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Learning budget',
          'Conference tickets',
          'Flexible hours'
        ],
        department: 'Engineering',
        posted: '3 days ago'
      },
      {
        id: 3,
        title: 'Python Backend Developer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$75k - $110k',
        description: 'Looking for a Python expert to build robust backend systems and data processing pipelines.',
        requirements: [
          '4+ years of Python experience',
          'Experience with Django or FastAPI',
          'Knowledge of SQL and NoSQL databases',
          'Experience with AWS services',
          'Understanding of data structures'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Health insurance',
          'Gym membership',
          'Flexible hours'
        ],
        department: 'Engineering',
        posted: '1 week ago'
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$90k - $130k',
        description: 'Join our platform team to build and maintain our cloud infrastructure and CI/CD pipelines.',
        requirements: [
          '3+ years of DevOps experience',
          'Strong AWS/Azure/GCP knowledge',
          'Experience with Kubernetes',
          'Infrastructure as Code (Terraform)',
          'CI/CD pipeline expertise'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Home office stipend',
          'Professional development',
          'Flexible hours'
        ],
        department: 'Platform',
        posted: '5 days ago'
      },
      {
        id: 5,
        title: 'UI/UX Designer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$60k - $90k',
        description: 'Create beautiful and intuitive user experiences for our products. Work closely with developers to bring designs to life.',
        requirements: [
          '3+ years of UI/UX experience',
          'Proficiency in Figma',
          'Understanding of user research',
          'Experience with design systems',
          'Portfolio of work'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Creative freedom',
          'Design tools budget',
          'Flexible hours'
        ],
        department: 'Design',
        posted: '1 week ago'
      },
      {
        id: 6,
        title: 'Junior Node.js Developer',
        type: 'Full-time',
        location: 'Remote',
        salary: '$50k - $70k',
        description: 'Great opportunity for junior developers to grow their skills in a supportive environment with mentorship.',
        requirements: [
          '1-2 years of Node.js experience',
          'Basic understanding of Express',
          'Knowledge of JavaScript/TypeScript',
          'Eagerness to learn',
          'Good problem-solving skills'
        ],
        benefits: [
          'Competitive salary',
          'Remote work',
          'Mentorship program',
          'Learning budget',
          'Flexible hours'
        ],
        department: 'Engineering',
        posted: 'Just now'
      }
    ];

    setJobs(jobData);
    setStats({
      total: jobData.length,
      open: jobData.length,
      remote: jobData.filter(j => j.location === 'Remote').length,
      fulltime: jobData.filter(j => j.type === 'Full-time').length
    });
  }, []);

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => 
        job.title.toLowerCase().includes(filter.toLowerCase()) ||
        job.department.toLowerCase().includes(filter.toLowerCase())
      );

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 5% 40px',
        background: dark ? 'rgba(0,229,255,0.02)' : 'rgba(0,150,255,0.02)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20px 20px, #00e5ff 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span style={{
            display: "inline-block",
            background: "rgba(0,229,255,0.12)",
            border: "1px solid rgba(0,229,255,0.35)",
            color: "#00e5ff",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontFamily: "'Space Mono',monospace",
            letterSpacing: 1,
            marginBottom: 20
          }}>
            🚀 WE'RE HIRING
          </span>

          <h1 style={{
            fontSize: "clamp(2.2rem,6vw,4rem)",
            fontWeight: 900,
            color: C.text,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Join Our <span style={{ color: "#00e5ff" }}>Growing Team</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem,2vw,1.2rem)",
            color: C.muted,
            maxWidth: 700,
            margin: "0 auto 40px",
            lineHeight: 1.8
          }}>
            We're looking for passionate developers, designers, and engineers to help us build the future of web development.
            Remote work, competitive salary, and amazing benefits.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00e5ff' }}>{stats.open}+</div>
              <div style={{ fontSize: 13, color: C.muted }}>Open Positions</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#bf5fff' }}>{stats.remote}</div>
              <div style={{ fontSize: 13, color: C.muted }}>Remote Roles</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#00ffb3' }}>{stats.fulltime}</div>
              <div style={{ fontSize: 13, color: C.muted }}>Full-time</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#ff9d00' }}>24/7</div>
              <div style={{ fontSize: 13, color: C.muted }}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section style={{ padding: '30px 5% 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 15
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text }}>
              Available <span style={{ color: '#00e5ff' }}>Positions</span>
            </h2>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: C.text,
                  fontSize: 13
                }}
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="platform">Platform</option>
                <option value="node.js">Node.js</option>
                <option value="react">React</option>
                <option value="python">Python</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section style={{ padding: '20px 5% 60px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 20
        }}>
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              dark={dark}
              C={C}
            />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontSize: 18, color: C.text, marginBottom: 10 }}>No positions found</h3>
            <p style={{ color: C.muted }}>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </section>

      {/* Why Join Us Section */}
      <section style={{
        padding: '60px 5%',
        background: dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,200,0.025)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            textAlign: 'center',
            color: C.text,
            marginBottom: 40
          }}>
            Why <span style={{ color: '#00e5ff' }}>Join Us?</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20
          }}>
            {[
              {
                icon: '🌍',
                title: 'Remote First',
                desc: 'Work from anywhere in the world. We believe in location independence.'
              },
              {
                icon: '💰',
                title: 'Competitive Salary',
                desc: 'Top market compensation with regular reviews and bonuses.'
              },
              {
                icon: '📈',
                title: 'Growth Opportunities',
                desc: 'Clear career paths and professional development budget.'
              },
              {
                icon: '⚡',
                title: 'Latest Tech',
                desc: 'Work with cutting-edge technologies and modern stacks.'
              },
              {
                icon: '🎓',
                title: 'Learning Budget',
                desc: '$2000/year for courses, conferences, and certifications.'
              },
              {
                icon: '🏥',
                title: 'Health Insurance',
                desc: 'Comprehensive health coverage for you and your family.'
              },
              {
                icon: '⏰',
                title: 'Flexible Hours',
                desc: 'Choose your own schedule. Focus on results, not hours.'
              },
              {
                icon: '🎉',
                title: 'Team Events',
                desc: 'Regular virtual and in-person team gatherings.'
              }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,229,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 15 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplyModal && selectedJob && (
        <CareersPopup
          onClose={() => setShowApplyModal(false)}
          dark={dark}
          C={C}
          position={selectedJob.title}
        />
      )}
    </div>
  );
}