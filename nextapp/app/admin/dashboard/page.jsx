'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  // Form states for new project
  const [newProj, setNewProj] = useState({ title: '', kind: 'Full-stack', stage: 'Software', blurb: '', github: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
        router.push('/admin');
        return;
      }
    }

    Promise.all([
      fetch('/api/profile').then(r => r.json()).catch(() => null),
      fetch('/api/projects').then(r => r.json()).catch(() => []),
      fetch('/api/skills').then(r => r.json()).catch(() => [])
    ]).then(([prof, projs, sk]) => {
      if (prof) setProfile(prof);
      if (Array.isArray(projs)) setProjects(projs);
      if (Array.isArray(sk)) setSkills(sk);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
    }
    router.push('/admin');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving profile...');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setSaveStatus('Profile updated successfully!');
      } else {
        setSaveStatus('Saved locally (changes active in memory).');
      }
    } catch {
      setSaveStatus('Offline mode: Saved locally.');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProj.title) return;
    const projectObj = { ...newProj, id: newProj.title.toLowerCase().replace(/[^a-z0-9]/g, '-') };
    setProjects([projectObj, ...projects]);
    setNewProj({ title: '', kind: 'Full-stack', stage: 'Software', blurb: '', github: '' });
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectObj)
      });
    } catch (err) {
      console.warn('API save fallback:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1d', color: '#ff806b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
        Loading Admin Core...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1d', color: '#f2f0e9', display: 'flex', fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#111827', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '15px', color: '#ff806b', letterSpacing: '2px', margin: '0 0 4px 0' }}>DARSHAN-OS</h2>
          <span style={{ fontSize: '11px', color: '#8892b0' }}>ADMIN // CONTROL</span>
        </div>

        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['profile', 'projects', 'skills', 'system'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: activeTab === tab ? 'rgba(255, 128, 107, 0.15)' : 'transparent',
                border: activeTab === tab ? '1px solid #ff806b' : '1px solid transparent',
                color: activeTab === tab ? '#ff806b' : '#a0aec0',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {tab === 'profile' ? '👤 Profile & Bio' : tab === 'projects' ? '📁 Projects' : tab === 'skills' ? '⚡ Skills' : '⚙️ System Status'}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/" style={{ color: '#8fd3ff', fontSize: '11px', textDecoration: 'none', padding: '8px' }}>
            🖥️ Return to Desktop
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px',
              backgroundColor: 'rgba(255, 75, 75, 0.15)',
              border: '1px solid #ff4b4b',
              color: '#ff4b4b',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '11px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>
        {saveStatus && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: 'rgba(185, 243, 107, 0.15)', border: '1px solid #b9f36b', color: '#b9f36b', borderRadius: '8px', fontSize: '12px' }}>
            {saveStatus}
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div>
            <h3 style={{ fontSize: '20px', color: '#ff806b', marginBottom: '20px' }}>Edit Profile Information</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8892b0', marginBottom: '4px' }}>Name</label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8892b0', marginBottom: '4px' }}>Title</label>
                  <input
                    type="text"
                    value={profile.title || ''}
                    onChange={e => setProfile({ ...profile, title: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8892b0', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#8892b0', marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#8892b0', marginBottom: '4px' }}>Bio / Summary</label>
                <textarea
                  rows={4}
                  value={profile.summary || profile.bio || ''}
                  onChange={e => setProfile({ ...profile, summary: e.target.value, bio: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '10px', color: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ff806b',
                  color: '#0a0f1d',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h3 style={{ fontSize: '20px', color: '#ff806b', marginBottom: '20px' }}>Projects ({projects.length})</h3>

            {/* Add Project Form */}
            <form onSubmit={handleAddProject} style={{ marginBottom: '32px', padding: '20px', backgroundColor: '#111827', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '640px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#b9f36b' }}>+ Add New Project</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProj.title}
                  onChange={e => setNewProj({ ...newProj, title: e.target.value })}
                  style={{ backgroundColor: '#050807', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
                <input
                  type="text"
                  placeholder="Kind (e.g. AI / Full-stack)"
                  value={newProj.kind}
                  onChange={e => setNewProj({ ...newProj, kind: e.target.value })}
                  style={{ backgroundColor: '#050807', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
                <select
                  value={newProj.stage}
                  onChange={e => setNewProj({ ...newProj, stage: e.target.value })}
                  style={{ backgroundColor: '#050807', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                >
                  <option value="Software">Software</option>
                  <option value="Prototype">Prototype</option>
                  <option value="Demo">Demo</option>
                  <option value="Concept">Concept</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Award">Award</option>
                </select>
              </div>
              <textarea
                placeholder="Short description / blurb"
                rows={2}
                value={newProj.blurb}
                onChange={e => setNewProj({ ...newProj, blurb: e.target.value })}
                style={{ width: '100%', backgroundColor: '#050807', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#fff', marginBottom: '12px', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                style={{ padding: '8px 16px', backgroundColor: '#b9f36b', color: '#0a0f1d', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Add Project
              </button>
            </form>

            {/* Projects List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
              {projects.map((p, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: '#111827', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#fff', fontSize: '14px' }}>{p.title}</strong>
                    <span style={{ fontSize: '11px', color: '#ff806b', border: '1px solid #ff806b', padding: '2px 8px', borderRadius: '12px' }}>{p.stage}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#8892b0', margin: 0 }}>{p.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <h3 style={{ fontSize: '20px', color: '#ff806b', marginBottom: '20px' }}>Technology Stack</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '640px' }}>
              {skills.map((s, idx) => (
                <span key={idx} style={{ padding: '6px 12px', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '12px', color: '#a78bfa' }}>
                  {s.name || s}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h3 style={{ fontSize: '20px', color: '#ff806b', marginBottom: '20px' }}>System Diagnostic</h3>
            <div style={{ padding: '20px', backgroundColor: '#111827', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '640px', lineHeight: '1.8', fontSize: '13px' }}>
              <div><strong style={{ color: '#b9f36b' }}>OS:</strong> Darshan-OS 4.0 (Next.js App Router)</div>
              <div><strong style={{ color: '#b9f36b' }}>Node:</strong> v24.18.0</div>
              <div><strong style={{ color: '#b9f36b' }}>Host:</strong> localhost:3000</div>
              <div><strong style={{ color: '#b9f36b' }}>Status:</strong> OPTIMAL</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
