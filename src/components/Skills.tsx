import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Technical expertise across the full development stack with a proven track record of innovation and excellence.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(skillsData).map(([category, skills], index) => (
              <SkillCategory key={category} category={category} skills={skills} index={index} />
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">Experience & Education</h3>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary animate-pulse"></div>
              <div className="space-y-8">
                {experienceData.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    className="relative flex items-start space-x-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {experience.year}
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-lg mb-1">{experience.title}</h4>
                      <p className="text-muted-foreground mb-2">{experience.subtitle}</p>
                      <p className="text-sm text-muted-foreground">{experience.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Key Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievementsData.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
