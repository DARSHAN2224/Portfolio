import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Experience from '@/lib/models/Experience';

const DEFAULT_EXPERIENCE = [
  {
    role: 'Full Stack Developer',
    org: 'MECNTEC Solution Pvt. Ltd., Bengaluru',
    when: 'Jun 2026 – Present',
    points: [
      'Developing and maintaining full-stack web applications and AI-integrated features.',
      'Working on WhatsApp Cloud API messaging workflows and LLM-driven response handling for customer communication.',
      'Building responsive user interfaces, REST APIs and database-driven modules.',
      'Integrating frontend, backend and AI capabilities with clean architecture; contributing to debugging, code reviews and API testing.'
    ]
  },
  {
    role: 'Backend Developer Intern',
    org: 'Nagarjuna Tech Solutions, Bengaluru',
    when: 'Jan 2025 – Apr 2025',
    points: [
      'Developed 30+ RESTful APIs using Node.js and MongoDB for core application workflows.',
      'Built modular backend services for authentication, restaurant operations, menu management and order lifecycle processing.',
      'Optimised database queries to improve endpoint response time and backend performance.',
      'Created test data and API test scripts in Postman, reducing integration defects by 30%.'
    ]
  }
];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const exp = await Experience.find({ isVisible: true }).sort({ startDate: -1 });
      if (exp && exp.length > 0) return NextResponse.json(exp);
    }
  } catch (error) {
    console.warn('Experience DB fetch fallback:', error.message);
  }
  return NextResponse.json(DEFAULT_EXPERIENCE);
}
