import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Profile from '@/lib/models/Profile';

const DEFAULT_PROFILE = {
  name: 'Darshan P',
  title: 'AI & Full Stack Engineer',
  email: 'pdarshan2224@gmail.com',
  phone: '+91-6363757497',
  location: 'Bengaluru, India',
  github: 'https://github.com/DARSHAN2224',
  linkedin: 'https://www.linkedin.com/in/pdarshan2224/',
  leetcode: 'https://leetcode.com/u/darshan2224/',
  gfg: 'https://geeksforgeeks.org/user/darshan2224/',
  roles: ['AI & Full-Stack Engineer', 'Full Stack Developer', 'Backend Developer', 'LLM & RAG Builder', 'Problem Solver'],
  summary: 'Computer Science and Engineering graduate skilled in full-stack development (MERN and Spring Boot) and AI/ML, with emphasis on backend development, API integration, web applications and AI-driven software solutions.',
  edu: {
    degree: 'Bachelor of Engineering, Computer Science & Engineering',
    school: 'Nagarjuna College of Engineering & Technology (NCET), Bengaluru',
    when: 'Aug 2022 – Jun 2026',
    cgpa: '8.94 / 10.0'
  },
  systemStatus: 'OPTIMAL'
};

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const profile = await Profile.findOne();
      if (profile) return NextResponse.json(profile);
    }
  } catch (error) {
    console.warn('Profile DB fetch fallback:', error.message);
  }
  return NextResponse.json(DEFAULT_PROFILE);
}
