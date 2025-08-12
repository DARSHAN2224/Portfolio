import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback } from 'react';

interface Project {
  id: string;
  title: string;
  impactStatement: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  images: Array<{ url: string; alt?: string }>;
  showDemoButton?: boolean;
  showGithubButton?: boolean;
  createdAt: string;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = useCallback(() => {
    if (!project.images || project.images.length === 0) return;
    
    setCurrentImageIndex((prev) => {  
      const next = (prev + 1) % project.images.length;
      return next;
    });
  }, [project.images]);

  const prevImage = useCallback(() => {
    if (!project.images || project.images.length === 0) return;
    
    setCurrentImageIndex((prev) => {
      const prevIndex = prev === 0 ? project.images.length - 1 : prev - 1;
      return prevIndex;
    });
  }, [project.images]);

  const goToImage = (index: number) => {
    if (!project.images || index < 0 || index >= project.images.length) return;
    setCurrentImageIndex(index);
  };

  // Reset current image index if all images have errors
  useEffect(() => {
    if (project.images && project.images.length > 0) {
      if (currentImageIndex >= project.images.length) {
        setCurrentImageIndex(0);
      }
    }
  }, [project.images, currentImageIndex]);

  // Auto-advance to next image
  useEffect(() => {
    if (!isAutoPlaying || !project.images || project.images.length <= 1) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextImage, project.images]);

  // Safety check for current image index
  useEffect(() => {
    if (project.images && project.images.length > 0) {
      if (currentImageIndex >= project.images.length) {
        setCurrentImageIndex(0);
      }
    }
  }, [project.images, currentImageIndex]);

  // Reset image loading state when image changes
  useEffect(() => {
    setImageLoading(true);
    setImageLoadErrors(new Set());
  }, [currentImageIndex]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const imageIndex = parseInt(target.dataset.imageIndex || '0');
    setImageLoadErrors(prev => new Set([...prev, imageIndex]));
    
    // Try to move to next image if current one fails
    if (project.images && project.images.length > 1) {
      const nextIndex = (imageIndex + 1) % project.images.length;
      if (!imageLoadErrors.has(nextIndex)) {
        setCurrentImageIndex(nextIndex);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Check if current image has an error
  const currentImageHasError = imageLoadErrors.has(currentImageIndex);
  const hasValidImages = project.images && project.images.length > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="project-card h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {project.impactStatement}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden group shadow-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {hasValidImages ? (
              <div className="relative w-full h-full">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={project.images[currentImageIndex]?.url}
                    alt={project.images[currentImageIndex]?.alt || `Project ${index + 1} image ${currentImageIndex + 1}`}
                    className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    data-image-index={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                </AnimatePresence>
                
                {/* Navigation arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="carousel-nav-btn absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="carousel-nav-btn absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                )}

                {/* Image dots */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {project.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          idx === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center text-white/70 p-6">
                  <div className="text-6xl mb-4 opacity-50">🖼️</div>
                  <div className="text-lg font-semibold mb-2">No Images Available</div>
                  <div className="text-sm opacity-80">Use the admin panel to upload project screenshots</div>
                  <div className="text-xs opacity-60 mt-2">Click the shield icon in the bottom-right corner</div>
                </div>
              </div>
            )}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 pt-4">
          {project.showGithubButton !== false && project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
          {project.demoUrl && project.showDemoButton !== false && (
            <Button variant="default" size="sm" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      // Try API first
      const response = await fetch('/api/projects');
      if (response.ok) {
        const result = await response.json();
        // API returns projects array directly
        if (Array.isArray(result)) {
          setProjects(result);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to static JSON for static hosting (read-only)
      const staticRes = await fetch('/data/projects.json');
      if (staticRes.ok) {
        const json = await staticRes.json();
        const normalized = (Array.isArray(json) ? json : []).map((p: any) => ({
          ...p,
          images: Array.isArray(p.images)
            ? p.images.map((img: any) => (typeof img === 'string' ? { url: img } : img))
            : [],
        }));
        setProjects(normalized);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setIsLoading(false);
      // Fallback to empty array
      setProjects([]);
    }
  };

  // Load projects on mount and listen for real-time updates
  useEffect(() => {
    loadProjects();
    
    // Listen for real-time content updates
    const handleContentUpdate = (event: CustomEvent) => {
      const { type, action, timestamp } = event.detail;
      
      // Automatically reload projects when content is updated
      if (type === 'projects') {
        loadProjects();
      }
    };

    // Listen for content updates
    window.addEventListener('portfolioContentUpdate', handleContentUpdate as EventListener);
    
    // Also check localStorage for updates (fallback)
    const checkForUpdates = () => {
      const lastUpdate = localStorage.getItem('portfolioLastUpdate');
      const updateType = localStorage.getItem('portfolioUpdateType');
      
      if (lastUpdate && updateType) {
        const [type, action] = updateType.split(':');
        if (type === 'projects') {
          loadProjects();
        }
      }
    };
    
    // Check for updates every 2 seconds as fallback
    const intervalId = setInterval(checkForUpdates, 2000);
    
    return () => {
      window.removeEventListener('portfolioContentUpdate', handleContentUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Explore my latest work showcasing full-stack development, AI integration, and innovative solutions
          </p>
          
          {/* Real-time update indicator */}
          {isUpdating && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Updating content...</span>
            </div>
          )}
        </motion.div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No projects available yet.</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground mb-4">
            Want to see more of my work or discuss a project?
          </p>
          <Button
            onClick={() =>
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-hero"
          >
            Let's Build Something Together
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
