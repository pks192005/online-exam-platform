'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'teacher':
          router.push('/teacher/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'free':
          router.push('/free/questions');
          break;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Exam Management System</h1>
            <div className="space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Exam Management System
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A comprehensive platform for creating, managing, and taking exams online.
            Perfect for teachers, students, and educational institutions.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3">Create Exams</h3>
              <p className="text-gray-600">
                Design comprehensive exams with multiple question types including MCQ, True/False, Fill-in-the-Blanks, and Essays.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Auto-Grading</h3>
              <p className="text-gray-600">
                Automatic grading for objective questions with manual grading support for essay-type questions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Analytics</h3>
              <p className="text-gray-600">
                Track student performance with detailed analytics and insights for better learning outcomes.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Try it Free!</h3>
            <p className="text-gray-600 mb-6">
              Create and test up to 5 questions without registration
            </p>
            <Link 
              href="/free/questions" 
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-4 gap-6 text-left">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Free Users</h4>
              <p className="text-sm text-gray-600">Test up to 5 questions</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Students</h4>
              <p className="text-sm text-gray-600">Take exams and view results</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Teachers</h4>
              <p className="text-sm text-gray-600">Create and manage exams</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Admins</h4>
              <p className="text-sm text-gray-600">Full system control</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 Exam Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
