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

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  }, [project.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  }, [project.images.length]);

  const goToImage = (index: number) => {
    if (index >= 0 && index < project.images.length) {
      setCurrentImageIndex(index);
    }
  };

  useEffect(() => {
    if (project.images.length <= 1) return;
    const interval = setInterval(() => {
      if (isAutoPlaying) {
        nextImage();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextImage, project.images.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

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
            {project.images.length > 0 ? (
              <>
                {/* Image */}
                <div className="relative w-full h-full z-10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={project.images[currentImageIndex]?.url || ''}
                      alt={project.images[currentImageIndex]?.alt || `${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  </AnimatePresence>
                </div>

                {/* Prev button */}
                {project.images.length > 1 && (
                  <>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Next button */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Counter */}
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-full text-sm backdrop-blur-md border border-white/20 shadow-lg z-20">
                  {currentImageIndex + 1} / {project.images.length}{' '}
                  {project.images.length > 1 && (isAutoPlaying ? '▶️' : '⏸️')}
                </div>

                {/* Dots */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {project.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx)}
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'bg-white border-white scale-125'
                            : 'bg-white/30 border-white/50 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-xl">
                <Image className="h-10 w-10 text-white" />
              </div>
            )}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          {project.demoUrl && project.showDemoButton !== false && (
            <Button variant="default" size="sm" asChild>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}

          {project.showGithubButton !== false && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
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

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const result = await res.json();
      if (result.ok) {
        setProjects(result.projects || []);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and passion for creating impactful solutions.
          </p>
        </motion.div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
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
