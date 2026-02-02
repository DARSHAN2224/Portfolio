import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CopilotWidget from '../components/CopilotWidget';

const Blog = ({ chatHistory, setChatHistory }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blogs');
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // State for currently active post
    const [selectedPost, setSelectedPost] = useState(null);

    return (
        <div className="h-full w-full bg-background-dark p-6 overflow-hidden flex flex-col font-sans">
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Column (Engineering Logs Window) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Window Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-white/10 select-none">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded bg-orange-500/20">
                                <span className="material-symbols-outlined text-orange-400 text-sm">rss_feed</span>
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Engineering Logs</span>
                        </div>
                        <div className="flex gap-1.5 opacity-100 transition-opacity group">
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-[8px] text-black/50 transition-colors" title="Close">✕</button>
                            <button onClick={() => navigate('/desktop')} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Minimize">─</button>
                            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-[8px] text-black/50 transition-colors cursor-pointer" title="Expand">⤢</button>
                        </div>
                    </div>

                    {/* Toolbar (New addition including Breadcrumb) */}
                    <div className="px-4 py-2 border-b border-white/5 bg-[#0d1117]/50 flex items-center gap-4 text-[10px] font-mono text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/desktop')}>~/home</span>
                            <span>/</span>
                            <span className="text-primary">blog</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <span>&gt; Accessing archives...</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0d1117]/30">
                        {loading ? (
                            <div className="max-w-4xl mx-auto p-12 space-y-8 animate-pulse">
                                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5"></div>)}
                            </div>
                        ) : selectedPost ? (
                            // Detail View
                            <div className="bg-[#0d1117] border border-white/5 rounded-xl p-8 min-h-full">
                                <button onClick={() => setSelectedPost(null)} className="mb-6 flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-mono group">
                                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span> RETURN_TO_LIST
                                </button>
                                <article className="prose prose-invert max-w-none">
                                    <div className="flex gap-2 mb-4">
                                        {selectedPost.tags?.map(tag => (
                                            <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">#{tag}</span>
                                        ))}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">{selectedPost.title}</h1>
                                    <p className="text-xl text-gray-400 font-light mb-8 leading-relaxed border-l-4 border-primary pl-4">{selectedPost.excerpt}</p>

                                    <div className="flex items-center justify-between py-4 border-y border-white/10 text-sm text-gray-500 font-mono mb-8">
                                        <span>PUBLISHED: {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                                        <span>READ_TIME: {selectedPost.readTime}</span>
                                    </div>

                                    <div className="text-gray-300 leading-7 font-sans whitespace-pre-line">
                                        {selectedPost.content}
                                    </div>
                                </article>
                            </div>
                        ) : (
                            // List View
                            <div className="grid grid-cols-1 gap-6">
                                {posts.map((post) => (
                                    <article
                                        key={post._id}
                                        onClick={() => setSelectedPost(post)}
                                        className="group cursor-pointer relative"
                                    >
                                        <div className="p-6 rounded-xl border border-white/10 bg-[#161b22] hover:border-primary/50 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                                            <div className="flex items-center justify-between mb-3 text-xs font-mono text-gray-500">
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded border border-white/5">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {post.readTime}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{post.title}</h2>
                                            <p className="text-gray-400 leading-relaxed mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {post.tags?.map(tag => (
                                                        <span key={tag} className="text-[10px] px-2 py-1 rounded bg-black/30 text-gray-500 border border-white/5 group-hover:border-white/10 font-mono">#{tag}</span>
                                                    ))}
                                                </div>
                                                <span className="text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                                                    Read_Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}

                                {posts.length === 0 && (
                                    <div className="text-center py-20 bg-[#161b22] rounded-xl border border-white/5 border-dashed">
                                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">rss_feed</span>
                                        <p className="text-gray-500 font-mono">No logs found in the archives.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Embedded Copilot */}
                <div className="hidden lg:block lg:col-span-4 h-full bg-[#050a10] rounded-xl overflow-hidden border border-white/5">
                    <CopilotWidget chatHistory={chatHistory} setChatHistory={setChatHistory} className="h-full" />
                </div>
            </div>
        </div>
    );
};

export default Blog;
