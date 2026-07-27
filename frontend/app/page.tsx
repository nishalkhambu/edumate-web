"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10 lg:max-w-7xl lg:mx-auto">
        <Link href="/" className="text-2xl font-bold text-blue-600">EduMate</Link>

        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
          <Link href="#about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/login" className="hover:text-blue-600 transition">Login</Link>
          <Link href="/register" className="hover:text-blue-600 transition">Get Started</Link>
        </div>

        <div className="hidden md:flex gap-3">
          <Link href="/login" className="text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition text-sm font-medium">Sign in</Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-md text-sm font-medium">Get Started</Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden rounded-lg border border-gray-300 p-2 text-gray-700"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-6 mb-4 rounded-xl border border-gray-200 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            <Link href="#features" className="hover:text-blue-600">Features</Link>
            <Link href="#about" className="hover:text-blue-600">About</Link>
            <Link href="/login" className="hover:text-blue-600">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">Get Started</Link>
          </div>
        </div>
      )}

      <section className="flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
        <div className="mb-6 rounded-full bg-blue-100 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm">
          Smart Learning Platform
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-gray-800 sm:text-5xl md:text-7xl">
          Learn Smarter With <span className="text-blue-600">EduMate</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-500">
          A modern Student Learning Management System that helps students organize courses, track progress, manage assignments, and improve learning productivity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="rounded-full bg-blue-600 px-8 py-3.5 text-white text-lg font-medium shadow-lg hover:bg-blue-700 hover:scale-105 transition">
            Get Started
          </Link>
          <Link href="#features" className="rounded-full border border-gray-300 bg-white px-8 py-3.5 text-lg font-medium text-gray-700 hover:bg-gray-100 transition">
            Explore Features
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-3xl font-bold text-blue-600">10K+</h2>
            <p className="mt-2 text-gray-500">Active Students</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-3xl font-bold text-blue-600">500+</h2>
            <p className="mt-2 text-gray-500">Courses Available</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-3xl font-bold text-blue-600">99%</h2>
            <p className="mt-2 text-gray-500">Student Satisfaction</p>
          </div>
        </div>
      </section>
    </main>
  );
}