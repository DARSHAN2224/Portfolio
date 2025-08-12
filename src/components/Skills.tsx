import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skillsData, achievementsData, experienceData } from '@/lib/data';

const glassCard = `
  bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg
  hover:shadow-[0_0_20px_#00f0ff] hover:border-[#00f0ff] hover:text-[#00f0ff]
  transition-all duration-300 hover:scale-[1.05] rounded-xl
`;

const SkillCategory = ({ category, skills, index }: { category: string, skills: string[], index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex"
    >
      <Card
        className={`flex flex-col justify-between w-full h-60 group ${glassCard}`}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-[#00f0ff] group-hover:to-[#00c8ff] transition-colors">
            {category}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, skillIndex) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: skillIndex * 0.05 }}
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-white
                    group-hover:from-[#00f0ff]/20 group-hover:to-[#00c8ff]/20
                    hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_15px_#00f0ff]
                    transition-all duration-300 text-sm"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AchievementCard = ({ achievement, index }: { achievement: any, index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`group h-56 ${glassCard}`}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <motion.span
              className="text-3xl drop-shadow-lg"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {achievement.icon}
            </motion.span>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent group-hover:from-[#00f0ff] group-hover:to-[#00c8ff] transition-colors">
              {achievement.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground group-hover:text-white/90 transition-colors text-sm leading-relaxed">
            {achievement.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [experiences, setExperiences] = useState(experienceData);
  const [achievements, setAchievements] = useState(achievementsData);
  const [skills, setSkills] = useState(skillsData);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load data on mount and listen for real-time updates
  useEffect(() => {
    // Load experiences first since they're most critical
    loadExperiences();
    loadAchievements();
    loadSkills();
    
    // Listen for real-time content updates
    const handleContentUpdate = (event: CustomEvent) => {
      const { type, action, timestamp } = event.detail;
      
      // Automatically reload data when content is updated
      if (type === 'experiences') {
        loadExperiences();
      } else if (type === 'achievements') {
        loadAchievements();
      } else if (type === 'skills') {
        loadSkills();
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
        if (type === 'experiences' || type === 'achievements' || type === 'skills') {
          if (type === 'experiences') {
            loadExperiences();
          } else if (type === 'achievements') {
            loadAchievements();
          } else if (type === 'skills') {
            loadSkills();
          }
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
  
  // Monitor experiences state changes
  useEffect(() => {
  }, [experiences]);

  const loadExperiences = async () => {
    try {
      setIsUpdating(true);
      
      // Try API first with a shorter timeout for faster loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout for faster loading
      
      const response = await fetch('/api/experiences', { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.ok && Array.isArray(result.experiences)) {
          setExperiences(result.experiences);
          return;
        }
      }
      // Fallback to static data
      setExperiences(experienceData);
    } catch (err) {
      if (err.name === 'AbortError') {
        // API timeout, using fallback data
      } else {
        console.error('Error loading experiences:', err);
      }
      setExperiences(experienceData);
    } finally {
      setIsUpdating(false);
    }
  };

  const loadAchievements = async () => {
    try {
      setIsUpdating(true);
      
      // Try API first with a shorter timeout for faster loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout for faster loading
      
      const response = await fetch('/api/achievements', { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.ok && Array.isArray(result.achievements)) {
          setAchievements(result.achievements);
          return;
        }
      }
      // Fallback to static data
      setAchievements(achievementsData);
    } catch (err) {
      if (err.name === 'AbortError') {
        // API timeout, using fallback data
      } else {
        console.error('Error loading achievements:', err);
      }
      setAchievements(achievementsData);
    } finally {
      setIsUpdating(false);
    }
  };

  const loadSkills = async () => {
    try {
      setIsUpdating(true);
      
      // Try API first with a shorter timeout for faster loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout for faster loading
      
      const response = await fetch('/api/skills', { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.ok && result.skills) {
          setSkills(result.skills);
          return;
        }
      }
      // Fallback to static data
      setSkills(skillsData);
    } catch (err) {
      if (err.name === 'AbortError') {
        // API timeout, using fallback data
      } else {
        console.error('Error loading skills:', err);
      }
      setSkills(skillsData);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section id="skills" className="section-padding bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container-max">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive showcase of my technical expertise, achievements, and professional journey
          </p>
          {isUpdating && (
            <div className="mt-4 text-sm text-blue-600 animate-pulse">
              🔄 Updating content...
            </div>
          )}
        </motion.div>

        {/* Skills Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">Technical Skills</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, skillsList], index) => (
              <SkillCategory key={category} category={category} skills={skillsList} index={index} />
            ))}
          </div>
        </div>

        {/* Experience & Education Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">Experience & Education</h3>
          
          {isUpdating && (
            <div className="text-center text-blue-600 mb-4">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Updating content...</span>
              </div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary animate-pulse"></div>
              <div className="space-y-8">
                {experiences && experiences.length > 0 ? (
                  experiences.map((experience, index) => (
                    <motion.div
                      key={experience.id || `exp-${index}`}
                      className="relative flex items-start space-x-6"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {experience.year || 'N/A'}
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-lg mb-1">{experience.title || 'No Title'}</h4>
                        <p className="text-muted-foreground mb-2">{experience.subtitle || 'No Subtitle'}</p>
                        <p className="text-sm text-muted-foreground">{experience.description || 'No Description'}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No experiences found. Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Key Achievements</h3>
          <div className="text-center text-sm text-muted-foreground mb-4">
            Debug: {achievements.length} achievements loaded
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
