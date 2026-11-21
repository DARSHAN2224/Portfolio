import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';

const DEFAULT_PROJECTS = [
  {
    id: 'whatsapp',
    title: 'Real-Estate Conversational AI Platform (WhatsApp)',
    stage: 'Software',
    kind: 'Agentic AI',
    stack: ['Node.js', 'Redis', 'PostgreSQL', 'LangChain', 'RAG', 'WhatsApp Cloud API', 'WebSocket'],
    blurb: 'An agentic WhatsApp assistant for real-estate customer conversations, with retrieval-augmented answers and several LLM providers behind it.',
    points: [
      'Agentic WhatsApp AI platform built on the WhatsApp Cloud API.',
      'Multi-provider LLM failover across DeepSeek, GPT-4o-mini and Gemini.',
      'Dual-stream RAG engine; latency cut by 50% (~1.8s).',
      'Distributed messaging pipeline using Redis locks and single-flight request coalescing.',
      '19 automated test suites with 100% pass rate.',
      'Designed for 100k+ concurrent users.'
    ]
  },
  {
    id: 'voice',
    title: 'Voice Converter: Real-Time AI Translation',
    stage: 'Software',
    kind: 'Real-time AI',
    stack: ['Node.js', 'React.js', 'WebSocket', 'LangChain', 'NLP'],
    github: 'https://github.com/DARSHAN2224/voice-converter',
    blurb: 'Browser-based speech transcription and multilingual translation, streamed in audio chunks over WebSockets to keep conversion latency low.',
    points: [
      'Audio processed in chunks over WebSocket to reduce conversion latency.',
      'LangChain STT and TTS models behind browser-based voice converter.',
      'Supports 10+ languages.'
    ]
  },
  {
    id: 'food',
    title: 'Multi-Role Food Ordering System',
    stage: 'Software',
    kind: 'Full-stack',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs'],
    github: 'https://github.com/DARSHAN2224/food-ordering-system',
    blurb: 'A three-tier, role-based platform for Admin, Seller and User, covering the whole order lifecycle with JWT authentication and live analytics dashboard.',
    points: [
      'Role-based access control for Admin / Seller / User, secured with JWT.',
      'End-to-end order lifecycle: placement, tracking and fulfilment.',
      'Real-time analytics dashboard for order trends.',
      'MongoDB query optimisation for read performance as order volume grew.'
    ]
  },
  {
    id: 'health',
    title: 'HealthCare: AI-Powered Mental Health Platform',
    stage: 'Software',
    kind: 'Full-stack + AI',
    stack: ['Node.js', 'React', 'Python', 'Flask', 'MongoDB', 'NLP', 'Transformers', 'JWT'],
    github: 'https://github.com/DARSHAN2224/healthcare-ai',
    blurb: 'A mental-health platform with an AI chatbot, emotion analysis and personalised wellness support.',
    points: [
      'Full-stack platform featuring an AI chatbot, emotion analysis and personalised wellness support.',
      'NLP and Transformer-based models for emotion detection and context-aware conversations.',
      'JWT-based authentication and REST APIs for secure, role-based access.'
    ]
  },
  {
    id: 'aerlogisim',
    title: 'Aerlogisim',
    stage: 'Award',
    kind: 'Final-year project',
    award: 'Best Major Project Award, 1st Prize, among final-year engineering teams.',
    blurb: 'The project behind the Best Major Project Award.',
    stack: []
  }
];

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const projects = await Project.find({ isVisible: true }).sort({ createdAt: -1 });
      if (projects && projects.length > 0) {
        return NextResponse.json(projects);
      }
    }
  } catch (error) {
    console.warn('Projects DB fetch fallback:', error.message);
  }
  return NextResponse.json(DEFAULT_PROJECTS);
}

export async function POST(request) {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 503 });
    }
    const data = await request.json();
    const newProject = await Project.create(data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
