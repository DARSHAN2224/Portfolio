import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Skill from '@/lib/models/Skill';

const DEFAULT_SKILLS = [
  { name: 'JavaScript', category: 'Languages' },
  { name: 'Python', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'C++', category: 'Languages' },
  { name: 'Node.js', category: 'Backend & Systems' },
  { name: 'Express.js', category: 'Backend & Systems' },
  { name: 'Spring Boot', category: 'Backend & Systems' },
  { name: 'REST APIs', category: 'Backend & Systems' },
  { name: 'JWT', category: 'Backend & Systems' },
  { name: 'WebSocket', category: 'Backend & Systems' },
  { name: 'Redis', category: 'Backend & Systems' },
  { name: 'Flask', category: 'Backend & Systems' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'LLMs', category: 'AI & ML' },
  { name: 'RAG', category: 'AI & ML' },
  { name: 'LangChain', category: 'AI & ML' },
  { name: 'NLP', category: 'AI & ML' },
  { name: 'Transformers', category: 'AI & ML' },
  { name: 'Git', category: 'Tools & Platforms' },
  { name: 'Docker', category: 'Tools & Platforms' },
  { name: 'ServiceNow', category: 'Tools & Platforms' }
];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const skills = await Skill.find({ isVisible: true });
      if (skills && skills.length > 0) return NextResponse.json(skills);
    }
  } catch (error) {
    console.warn('Skills DB fetch fallback:', error.message);
  }
  return NextResponse.json(DEFAULT_SKILLS);
}
