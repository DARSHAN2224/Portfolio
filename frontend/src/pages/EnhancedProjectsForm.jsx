// Enhanced Projects Form Component with Edit, Image Upload, and Visibility Toggles
// Replace lines 850-983 in AdminPanel.jsx with this code

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

    const handleDelete = (id) => {
        if (!confirm('Delete this project?')) return;

        fetch(`http://localhost:5000/api/projects/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchProjects())
            .catch(err => console.error('Failed to delete project', err));
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

    return (
        <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">{editingId ? 'Edit Project' : 'Manage Projects'}</h3>

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
