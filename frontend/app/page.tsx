export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">
          EduMate
        </h1>

        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Features
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            About
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Contact
          </a>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-md">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        
        {/* Small Badge */}
        <div className="mb-6 rounded-full bg-blue-100 px-5 py-2 text-sm font-medium text-blue-700 shadow-sm">
          Smart Learning Platform
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold leading-tight text-gray-800">
          Learn Smarter With{" "}
          <span className="text-blue-600">
            EduMate
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-500">
          A modern Student Learning Management System that helps students
          organize courses, track progress, manage assignments, and improve
          learning productivity.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <button className="rounded-full bg-blue-600 px-8 py-4 text-white text-lg font-medium shadow-lg hover:bg-blue-700 hover:scale-105 transition">
            Get Started
          </button>

          <button className="rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-100 transition">
            Explore Features
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          
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