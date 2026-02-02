import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('desktop');
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        // Check auth
        const isAdmin = localStorage.getItem("isAdmin");
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [navigate]);

    return (
        <div className="font-display bg-[#0a0a0a] text-white min-h-screen flex selection:bg-red-900 selection:text-white">

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProfileModal(false)}>
                    <div className="bg-[#111] border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#111] border-b border-white/10 p-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">Profile Information</h3>
                            <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/5 rounded">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <ProfileForm />
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col bg-[#111]">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-widest text-white">ADMIN // CORE</h2>
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                        title="Profile Settings"
                    >
                        <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">account_circle</span>
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <AdminLInk icon="info" label="About Page" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
                    <AdminLInk icon="desktop_windows" label="Desktop Content" active={activeTab === 'desktop'} onClick={() => setActiveTab('desktop')} />
                    <AdminLInk icon="folder" label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                    <AdminLInk icon="bolt" label="Skills & Stack" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
                    <AdminLInk icon="work" label="Experience" active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
                    <AdminLInk icon="verified" label="Certificates" active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} />
                    <AdminLInk icon="hub" label="Network Links" active={activeTab === 'network'} onClick={() => setActiveTab('network')} />
                    <AdminLInk icon="article" label="Blog Posts" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
                    <AdminLInk icon="settings" label="System Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => { localStorage.removeItem("isAdmin"); navigate('/desktop'); }}
                        className="flex items-center gap-3 text-sm text-red-500 hover:text-red-400 transition-colors w-full px-4 py-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black p-8">
                {activeTab === 'about' && <AboutForm />}
                {activeTab === 'desktop' && <DesktopContentForm />}
                {activeTab === 'projects' && <ProjectsForm />}
                {activeTab === 'skills' && <SkillsForm />}
                {activeTab === 'experience' && <ExperienceForm />}
                {activeTab === 'certificates' && <CertificatesForm />}
                {activeTab === 'network' && <NetworkForm />}
                {activeTab === 'blog' && <BlogForm />}
                {activeTab === 'config' && <ConfigForm />}
            </main>
        </div>
    );
};

const AdminLInk = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        <span className="material-symbols-outlined">{icon}</span>
        {label}
    </button>
);

// --- Subcomponents for Forms (Mock UI) ---

const ProfileForm = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data || {});
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch profile', err);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setSaving(false);
                alert('Profile updated successfully!');
            })
            .catch(err => {
                console.error('Failed to save profile', err);
                setSaving(false);
                alert('Failed to save profile');
            });
    };

    if (loading) return <div className="text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">Edit Profile Information</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Full Name"
                        value={profile?.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Job Title"
                        value={profile?.title || ''}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Email"
                        value={profile?.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Phone"
                        value={profile?.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="GitHub URL"
                        value={profile?.github || ''}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="LinkedIn URL"
                        value={profile?.linkedin || ''}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                </div>
                <textarea
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white h-32"
                    placeholder="Bio / About Me"
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                ></textarea>

                {/* LeetCode Stats */}
                <div className="border-t border-white/10 pt-4 mt-4">
                    <h4 className="font-bold text-primary mb-3">LeetCode Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Total Solved"
                            type="number"
                            value={profile?.leetcodeStats?.solved || 0}
                            onChange={(e) => setProfile({ ...profile, leetcodeStats: { ...profile.leetcodeStats, solved: parseInt(e.target.value) || 0 } })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Easy"
                            type="number"
                            value={profile?.leetcodeStats?.easy || 0}
                            onChange={(e) => setProfile({ ...profile, leetcodeStats: { ...profile.leetcodeStats, easy: parseInt(e.target.value) || 0 } })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Medium"
                            type="number"
                            value={profile?.leetcodeStats?.medium || 0}
                            onChange={(e) => setProfile({ ...profile, leetcodeStats: { ...profile.leetcodeStats, medium: parseInt(e.target.value) || 0 } })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Hard"
                            type="number"
                            value={profile?.leetcodeStats?.hard || 0}
                            onChange={(e) => setProfile({ ...profile, leetcodeStats: { ...profile.leetcodeStats, hard: parseInt(e.target.value) || 0 } })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Ranking (e.g. Top 5%)"
                            value={profile?.leetcodeStats?.ranking || ''}
                            onChange={(e) => setProfile({ ...profile, leetcodeStats: { ...profile.leetcodeStats, ranking: e.target.value } })}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

const ExperienceForm = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [newExp, setNewExp] = useState({ company: '', position: '', startDate: '', endDate: '', description: '' });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = () => {
        fetch('http://localhost:5000/api/experience')
            .then(res => res.json())
            .then(data => {
                setExperiences(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch experience', err);
                setLoading(false);
            });
    };

    const handleSubmit = () => {
        if (!newExp.company || !newExp.position || !newExp.startDate) {
            alert('Please fill in Company, Position, and Start Date');
            return;
        }

        const url = editingId
            ? `http://localhost:5000/api/experience/${editingId}`
            : 'http://localhost:5000/api/experience';

        const method = editingId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newExp)
        })
            .then(res => res.json())
            .then(() => {
                fetchExperiences();
                resetForm();
            })
            .catch(err => console.error('Failed to save experience', err));
    };

    const handleEdit = (exp) => {
        setEditingId(exp._id);
        setNewExp({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate || '',
            description: exp.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setNewExp({ company: '', position: '', startDate: '', endDate: '', description: '' });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this experience?')) return;

        fetch(`http://localhost:5000/api/experience/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchExperiences())
            .catch(err => console.error('Failed to delete experience', err));
    };

    return (
        <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">Manage Experience</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <h4 className="font-bold text-lg mb-4 text-primary">Add New Role</h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Company"
                            value={newExp.company}
                            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Position"
                            value={newExp.position}
                            onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            type="date"
                            placeholder="Start Date"
                            value={newExp.startDate}
                            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                        />
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            type="date"
                            placeholder="End Date (Leave empty for Present)"
                            value={newExp.endDate}
                            onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                        />
                    </div>
                    <textarea
                        className="w-full bg-[#222] border border-[#333] rounded p-3 text-white h-24"
                        placeholder="Description"
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    ></textarea>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-black font-bold rounded hover:opacity-90"
                    >
                        {editingId ? 'Update Experience' : 'Add Experience'}
                    </button>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && experiences.length === 0 && <p className="text-gray-500 italic">No experience found.</p>}
                {experiences.map((exp) => (
                    <div key={exp._id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{exp.position}</h4>
                            <p className="text-xs text-slate-500">{exp.company} • {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(exp)}
                                className="p-2 hover:bg-blue-500/10 rounded text-slate-400 hover:text-blue-400"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(exp._id)}
                                className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SkillsForm = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', version: '', load: 90, icon: 'code_blocks', stability: 'STABLE' });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = () => {
        fetch('http://localhost:5000/api/skills')
            .then(res => res.json())
            .then(data => {
                setSkills(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch skills', err);
                setLoading(false);
            });
    };

    const handleSubmit = () => {
        if (!newSkill.name) {
            alert('Please enter a skill name');
            return;
        }

        const url = editingId
            ? `http://localhost:5000/api/skills/${editingId}`
            : 'http://localhost:5000/api/skills';

        const method = editingId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSkill)
        })
            .then(res => res.json())
            .then(() => {
                fetchSkills();
                resetForm();
            })
            .catch(err => console.error('Failed to save skill', err));
    };

    const handleEdit = (skill) => {
        setEditingId(skill._id);
        setNewSkill({
            name: skill.name,
            category: skill.category,
            version: skill.version || '',
            load: skill.load || 90,
            icon: skill.icon || 'code_blocks',
            stability: skill.stability || 'STABLE'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setNewSkill({ name: '', category: 'frontend', version: '', load: 90, icon: 'code_blocks', stability: 'STABLE' });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this skill?')) return;

        fetch(`http://localhost:5000/api/skills/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchSkills())
            .catch(err => console.error('Failed to delete skill', err));
    };

    return (
        <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">Manage Skills Matrix</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg text-primary">{editingId ? 'Update Module' : 'Add New Module'}</h4>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">
                            Cancel Edit
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Skill Name (e.g. React)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    />
                    <select
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="tools">Tools</option>
                    </select>
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Version (e.g. v18)"
                        value={newSkill.version}
                        onChange={(e) => setNewSkill({ ...newSkill, version: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        type="number"
                        placeholder="Load %"
                        value={newSkill.load}
                        onChange={(e) => setNewSkill({ ...newSkill, load: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-primary text-black font-bold rounded hover:opacity-90"
                >
                    {editingId ? 'Update Module' : 'Install Module'}
                </button>
            </div>

            <div className="space-y-2">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && skills.length === 0 && <p className="text-gray-500 italic">No skills found.</p>}
                {skills.map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded border border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-blue-400">{skill.icon}</span>
                            <div>
                                <p className="font-bold">{skill.name}</p>
                                <p className="text-xs text-slate-500">{skill.category} • {skill.version}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(skill)}
                                className="p-2 hover:bg-blue-500/10 rounded text-slate-400 hover:text-blue-400"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(skill._id)}
                                className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BlogForm = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBlog, setNewBlog] = useState({ title: '', slug: '', excerpt: '', content: '', tags: '', readTime: '5 min read', isPublished: true });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        fetch('http://localhost:5000/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch blogs', err);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        if (!newBlog.title || !newBlog.slug) {
            alert('Please fill in Title and Slug');
            return;
        }

        const blogData = {
            ...newBlog,
            tags: newBlog.tags.split(',').map(t => t.trim()).filter(t => t)
        };

        fetch('http://localhost:5000/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData)
        })
            .then(res => res.json())
            .then(() => {
                fetchBlogs();
                setNewBlog({ title: '', slug: '', excerpt: '', content: '', tags: '', readTime: '5 min read', isPublished: true });
            })
            .catch(err => console.error('Failed to add blog', err));
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this blog post?')) return;

        fetch(`http://localhost:5000/api/blogs/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchBlogs())
            .catch(err => console.error('Failed to delete blog', err));
    };

    return (
        <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-6">Content Management (Blog)</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <input
                    className="w-full bg-transparent text-xl font-bold mb-4 border-b border-white/10 pb-2 outline-none text-white"
                    placeholder="Enter Post Title..."
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                />
                <input
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white mb-4"
                    placeholder="Slug (e.g. my-blog-post)"
                    value={newBlog.slug}
                    onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                />
                <textarea
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white mb-4 h-20"
                    placeholder="Excerpt / Summary"
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                ></textarea>
                <textarea
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white mb-4 h-40"
                    placeholder="Content (Markdown supported)"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                ></textarea>
                <input
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white mb-4"
                    placeholder="Tags (comma separated)"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                />
                <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
                >
                    Publish Post
                </button>
            </div>

            <div className="space-y-2">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && blogs.length === 0 && <p className="text-gray-500 italic">No blog posts found.</p>}
                {blogs.map((blog) => (
                    <div key={blog._id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{blog.title}</h4>
                            <p className="text-xs text-slate-500">{blog.slug} • {blog.readTime}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ConfigForm = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/meta/config/user_roles')
            .then(res => res.json())
            .then(data => {
                if (data.value) setRoles(data.value);
            })
            .catch(err => console.error(err));
    }, []);

    const handleAddRole = () => {
        if (!newRole.trim()) return;
        const updatedRoles = [...roles, newRole.trim()];
        saveRoles(updatedRoles);
        setNewRole("");
    };

    const handleRemoveRole = (roleToRemove) => {
        const updatedRoles = roles.filter(r => r !== roleToRemove);
        saveRoles(updatedRoles);
    };

    const saveRoles = (updatedRoles) => {
        setLoading(true);
        fetch('/api/meta/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: 'user_roles',
                value: updatedRoles,
                description: 'Roles displayed in the typing animation on Desktop'
            })
        })
            .then(res => res.json())
            .then(data => {
                setRoles(data.value);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    return (
        <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-6">System Configuration</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <h4 className="font-bold text-lg mb-2 text-primary">Desktop Typing Animation Roles</h4>
                <p className="text-xs text-gray-400 mb-4">Manage the titles that cycle on the main desktop screen.</p>

                <div className="flex gap-2 mb-4">
                    <input
                        className="flex-1 bg-[#222] border border-[#333] rounded p-3 text-white outline-none focus:border-primary/50"
                        placeholder="Add a new role (e.g. 'Cloud Architect')"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleAddRole}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-black font-bold rounded hover:opacity-90 disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {roles.map((role, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
                            <span>{role}</span>
                            <button
                                onClick={() => handleRemoveRole(role)}
                                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ))}
                    {roles.length === 0 && <span className="text-slate-500 italic text-sm">No active roles defined.</span>}
                </div>
            </div>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
                <h4 className="font-bold text-lg mb-2 text-gray-400">Trend Analysis Settings</h4>
                <p className="text-xs text-gray-500">Manual override for user trend analysis is currently disabled (AI Managed).</p>
            </div>
        </div>
    );
};

const CertificatesForm = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', id_code: '', icon: 'verified', color: 'text-gray-400' });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = () => {
        fetch('http://localhost:5000/api/certificates')
            .then(res => res.json())
            .then(data => {
                setCertificates(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch certificates', err);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        if (!newCert.title || !newCert.issuer || !newCert.date) {
            alert('Please fill in Title, Issuer, and Date');
            return;
        }

        fetch('http://localhost:5000/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCert)
        })
            .then(res => res.json())
            .then(() => {
                fetchCertificates();
                setNewCert({ title: '', issuer: '', date: '', id_code: '', icon: 'verified', color: 'text-gray-400' });
            })
            .catch(err => console.error('Failed to add certificate', err));
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this certificate?')) return;

        fetch(`http://localhost:5000/api/certificates/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchCertificates())
            .catch(err => console.error('Failed to delete certificate', err));
    };

    return (
        <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">Manage Certificates</h3>

            {/* Add New Certificate */}
            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <h4 className="font-bold text-lg mb-4 text-purple-400">Add New Certificate</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Title (e.g. AWS Solutions Architect)"
                        value={newCert.title}
                        onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Issuer (e.g. Amazon Web Services)"
                        value={newCert.issuer}
                        onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Date (e.g. 2023)"
                        value={newCert.date}
                        onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Reference ID (Optional)"
                        value={newCert.id_code}
                        onChange={(e) => setNewCert({ ...newCert, id_code: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Icon (e.g. cloud, code)"
                        value={newCert.icon}
                        onChange={(e) => setNewCert({ ...newCert, icon: e.target.value })}
                    />
                    <select
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        value={newCert.color}
                        onChange={(e) => setNewCert({ ...newCert, color: e.target.value })}
                    >
                        <option value="text-yellow-400">Yellow</option>
                        <option value="text-blue-400">Blue</option>
                        <option value="text-green-400">Green</option>
                        <option value="text-purple-400">Purple</option>
                        <option value="text-red-400">Red</option>
                        <option value="text-gray-400">Gray</option>
                    </select>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
                >
                    Add Certificate
                </button>
            </div>

            {/* Existing Certificates List */}
            <div className="space-y-2">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && certificates.length === 0 && <p className="text-gray-500 italic">No certificates found.</p>}
                {certificates.map((cert) => (
                    <div key={cert._id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded border border-white/5">
                        <div className="flex items-center gap-4">
                            <span className={`material-symbols-outlined ${cert.color}`}>{cert.icon}</span>
                            <div>
                                <p className="font-bold">{cert.title}</p>
                                <p className="text-xs text-slate-500">{cert.issuer} • {cert.date}</p>
                                {cert.id_code && <p className="text-[10px] text-slate-600 font-mono">{cert.id_code}</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(cert._id)}
                            className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Projects Form Component
const ProjectsForm = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tags: '',
        domain: 'Full-Stack',
        links: { github: '', demo: '', docs: '' },
        imageUrl: '',
        showGithubButton: true,
        showLiveButton: true,
        isVisible: true
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        fetch('http://localhost:5000/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch projects', err);
                setLoading(false);
            });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setNewProject({ ...newProject, imageUrl: data.url });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        if (!newProject.title || !newProject.description) {
            alert('Please enter title and description');
            return;
        }

        const projectData = {
            ...newProject,
            tags: typeof newProject.tags === 'string'
                ? newProject.tags.split(',').map(t => t.trim()).filter(t => t)
                : newProject.tags
        };

        const url = editingId
            ? `http://localhost:5000/api/projects/${editingId}`
            : 'http://localhost:5000/api/projects';

        const method = editingId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        })
            .then(res => res.json())
            .then(() => {
                fetchProjects();
                resetForm();
            })
            .catch(err => console.error('Failed to save project', err));
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setNewProject({
            title: project.title,
            description: project.description,
            tags: project.tags?.join(', ') || '',
            domain: project.domain || 'Full-Stack',
            links: project.links || { github: '', demo: '', docs: '' },
            imageUrl: project.imageUrl || '',
            showGithubButton: project.showGithubButton !== false,
            showLiveButton: project.showLiveButton !== false,
            isVisible: project.isVisible !== false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setNewProject({
            title: '',
            description: '',
            tags: '',
            domain: 'Full-Stack',
            links: { github: '', demo: '', docs: '' },
            imageUrl: '',
            showGithubButton: true,
            showLiveButton: true,
            isVisible: true
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this project?')) return;

        fetch(`http://localhost:5000/api/projects/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchProjects())
            .catch(err => console.error('Failed to delete project', err));
    };

    return (
        <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">Manage Projects</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg text-primary">{editingId ? 'Update Project' : 'Add New Project'}</h4>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">
                            Cancel Edit
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="Project Title"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        />
                        <select
                            className="bg-[#222] border border-[#333] rounded p-3 text-white"
                            value={newProject.domain}
                            onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                        >
                            <option value="Full-Stack">Full-Stack</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="AI-ML">AI-ML</option>
                            <option value="ServiceNow">ServiceNow</option>
                            <option value="Research">Research</option>
                            <option value="Simulation">Simulation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <textarea
                        className="w-full bg-[#222] border border-[#333] rounded p-3 text-white h-24"
                        placeholder="Description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    ></textarea>
                    <input
                        className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Tags (comma separated)"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    />

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Project Image</label>
                        <div className="flex gap-4 items-start">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="bg-[#222] border border-[#333] rounded p-3 text-white flex-1"
                                disabled={uploading}
                            />
                            {uploading && <span className="text-primary">Uploading...</span>}
                        </div>
                        {newProject.imageUrl && (
                            <div className="mt-2">
                                <img src={newProject.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded border border-white/20" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-2">GitHub URL</label>
                            <input
                                className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                                placeholder="https://github.com/..."
                                value={newProject.links.github}
                                onChange={(e) => setNewProject({ ...newProject, links: { ...newProject.links, github: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-2">Live Demo URL</label>
                            <input
                                className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                                placeholder="https://..."
                                value={newProject.links.demo}
                                onChange={(e) => setNewProject({ ...newProject, links: { ...newProject.links, demo: e.target.value } })}
                            />
                        </div>
                    </div>

                    {/* Visibility Toggles */}
                    <div className="flex gap-6 items-center p-4 bg-[#1a1a1a] rounded">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newProject.showGithubButton}
                                onChange={(e) => setNewProject({ ...newProject, showGithubButton: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Show GitHub Button</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newProject.showLiveButton}
                                onChange={(e) => setNewProject({ ...newProject, showLiveButton: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Show Live Demo Button</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newProject.isVisible}
                                onChange={(e) => setNewProject({ ...newProject, isVisible: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Visible on Site</span>
                        </label>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-black font-bold rounded hover:opacity-90"
                    >
                        {editingId ? 'Update Project' : 'Add Project'}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {loading && <p className="text-gray-500">Loading...</p>}
                {!loading && projects.length === 0 && <p className="text-gray-500 italic">No projects found.</p>}
                {projects.map((project) => (
                    <div key={project._id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded flex justify-between items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                {project.imageUrl && (
                                    <img src={project.imageUrl} alt={project.title} className="w-12 h-12 object-cover rounded" />
                                )}
                                <div>
                                    <h4 className="font-bold">{project.title}</h4>
                                    <p className="text-xs text-slate-500">{project.domain} • {project.tags?.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(project)}
                                className="p-2 hover:bg-blue-500/10 rounded text-slate-400 hover:text-blue-400"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(project._id)}
                                className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Network Form Component
const NetworkForm = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLink, setNewLink] = useState({ name: '', url: '', icon: 'link', status: 'ACTIVE', color: 'text-white', platform: 'social', rank: '', solved: 0 });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = () => {
        fetch('http://localhost:5000/api/social-links')
            .then(res => res.json())
            .then(data => {
                setLinks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch links', err);
                setLoading(false);
            });
    };

    const handleAdd = () => {
        if (!newLink.name || !newLink.url) {
            alert('Please enter name and URL');
            return;
        }

        fetch('http://localhost:5000/api/social-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLink)
        })
            .then(res => res.json())
            .then(() => {
                fetchLinks();
                setNewLink({ name: '', url: '', icon: 'link', status: 'ACTIVE', color: 'text-white', platform: 'social', rank: '', solved: 0 });
            })
            .catch(err => console.error('Failed to add link', err));
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this link?')) return;

        fetch(`http://localhost:5000/api/social-links/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchLinks())
            .catch(err => console.error('Failed to delete link', err));
    };

    const socialLinks = links.filter(l => l.platform === 'social');
    const codingLinks = links.filter(l => l.platform === 'coding');

    return (
        <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">Manage Network Links</h3>

            <div className="bg-[#111] p-6 rounded-xl border border-white/5 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg text-primary">{editingId ? 'Update Link' : 'Add New Link'}</h4>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">
                            Cancel Edit
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Name (e.g. GitHub)"
                        value={newLink.name}
                        onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="URL"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    />
                    <select
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        value={newLink.platform}
                        onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    >
                        <option value="social">Social Platform</option>
                        <option value="coding">Coding Platform</option>
                    </select>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-primary text-black font-bold rounded hover:opacity-90"
                >
                    Add Link
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-lg mb-3 text-blue-400">Social Platforms</h4>
                    <div className="space-y-2">
                        {socialLinks.map((link) => (
                            <div key={link._id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${link.color}`}>{link.icon}</span>
                                    <div>
                                        <p className="font-bold">{link.name}</p>
                                        <p className="text-xs text-slate-500">{link.url}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(link._id)}
                                    className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-3 text-green-400">Coding Platforms</h4>
                    <div className="space-y-2">
                        {codingLinks.map((link) => (
                            <div key={link._id} className="p-4 bg-[#1a1a1a] border border-white/5 rounded flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${link.color}`}>{link.icon}</span>
                                    <div>
                                        <p className="font-bold">{link.name}</p>
                                        <p className="text-xs text-slate-500">{link.rank} • {link.solved} solved</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(link._id)}
                                    className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Desktop Content Form Component
const DesktopContentForm = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data || {});
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch profile', err);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setSaving(false);
                alert('Desktop content updated!');
            })
            .catch(err => {
                console.error('Failed to save', err);
                setSaving(false);
                alert('Failed to save');
            });
    };

    if (loading) return <div className="text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">Edit Desktop Page Content</h3>
            <p className="text-sm text-gray-400 mb-6">Manage the profile card content that appears on the main Desktop page.</p>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Full Name (Display)</label>
                        <input
                            className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="DARSHAN PATEL"
                            value={profile?.name || ''}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Location</label>
                        <input
                            className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="San Francisco, CA"
                            value={profile?.location || ''}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Work Status</label>
                        <select
                            className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                            value={profile?.systemStatus || 'OPTIMAL'}
                            onChange={(e) => setProfile({ ...profile, systemStatus: e.target.value })}
                        >
                            <option value="OPTIMAL">OPEN TO WORK</option>
                            <option value="WARNING">CURRENTLY EMPLOYED</option>
                            <option value="ERROR">NOT AVAILABLE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-2">System Version</label>
                        <input
                            className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                            placeholder="DarshanOS v2.4"
                            value={profile?.systemDescription || ''}
                            onChange={(e) => setProfile({ ...profile, systemDescription: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-2">Uptime (Years of Experience)</label>
                    <input
                        className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="12 Years"
                        value={profile?.uptime || ''}
                        onChange={(e) => setProfile({ ...profile, uptime: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-2">Profile Image URL</label>
                    <input
                        className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="https://..."
                        value={profile?.avatar || ''}
                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                    />
                    {profile?.avatar && (
                        <div className="mt-2">
                            <img src={profile.avatar} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-white/20" />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Desktop Content'}
                </button>
            </div>
        </div>
    );
};

// About Form Component (reuses Profile data)
const AboutForm = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data || {});
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch profile', err);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        setSaving(true);
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        })
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setSaving(false);
                alert('About page content updated!');
            })
            .catch(err => {
                console.error('Failed to save', err);
                setSaving(false);
                alert('Failed to save');
            });
    };

    if (loading) return <div className="text-gray-500">Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6">Edit About Page Content</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Full Name"
                        value={profile?.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <input
                        className="bg-[#222] border border-[#333] rounded p-3 text-white"
                        placeholder="Job Title"
                        value={profile?.title || ''}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                </div>
                <input
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white"
                    placeholder="Location"
                    value={profile?.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
                <textarea
                    className="w-full bg-[#222] border border-[#333] rounded p-3 text-white h-48"
                    placeholder="About Me / Bio (This appears on the About page)"
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                ></textarea>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save About Page'}
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
