"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10 lg:max-w-7xl lg:mx-auto">
        <Link href="/" className="text-2xl font-bold text-indigo-400">EduMate</Link>

        <div className="hidden md:flex gap-8 text-slate-400 font-medium">
          <Link href="#features" className="hover:text-indigo-400 transition">Features</Link>
          <Link href="#about" className="hover:text-indigo-400 transition">About</Link>
          <Link href="/login" className="hover:text-indigo-400 transition">Login</Link>
          <Link href="/register" className="hover:text-indigo-400 transition">Get Started</Link>
        </div>

        <div className="hidden md:flex gap-3">
          <Link href="/login" className="text-slate-300 px-4 py-2 rounded-full hover:bg-slate-800 transition text-sm font-medium border border-slate-700">Sign in</Link>
          <Link href="/register" className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-400 transition shadow-lg text-sm font-medium">Get Started</Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden rounded-lg border border-slate-700 p-2 text-slate-300"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-6 mb-4 rounded-xl border border-slate-800 bg-[#1e293b] p-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-indigo-400">Features</Link>
            <Link href="#about" className="hover:text-indigo-400">About</Link>
            <Link href="/login" className="hover:text-indigo-400">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-indigo-500 px-4 py-2 text-center text-white hover:bg-indigo-400">Get Started</Link>
          </div>
        </div>
      )}

      <section className="flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
        <div className="mb-6 rounded-full bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-300 shadow-sm border border-indigo-500/20">
          Smart Learning Platform
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-slate-100 sm:text-5xl md:text-7xl">
          Learn Smarter With <span className="text-indigo-400">EduMate</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
          A modern Student Learning Management System that helps students organize courses, track progress, manage assignments, and improve learning productivity.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="rounded-full bg-indigo-500 px-8 py-3.5 text-white text-lg font-medium shadow-lg hover:bg-indigo-400 hover:scale-105 transition">
            Get Started
          </Link>
          <Link href="#features" className="rounded-full border border-slate-700 bg-[#1e293b] px-8 py-3.5 text-lg font-medium text-slate-300 hover:bg-slate-800 transition">
            Explore Features
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
          <div className="card-shadow rounded-2xl bg-[#1e293b] p-6 border border-slate-800">
            <h2 className="text-3xl font-bold text-indigo-400">10K+</h2>
            <p className="mt-2 text-slate-400">Active Students</p>
          </div>
          <div className="card-shadow rounded-2xl bg-[#1e293b] p-6 border border-slate-800">
            <h2 className="text-3xl font-bold text-indigo-400">500+</h2>
            <p className="mt-2 text-slate-400">Courses Available</p>
          </div>
          <div className="card-shadow rounded-2xl bg-[#1e293b] p-6 border border-slate-800">
            <h2 className="text-3xl font-bold text-indigo-400">99%</h2>
            <p className="mt-2 text-slate-400">Student Satisfaction</p>
          </div>
        </div>
      </section>
    </main>
  );
}
