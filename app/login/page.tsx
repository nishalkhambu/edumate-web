import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="auth-card">
      <div className="left-section">
        <div className="overlay">
          <h1>EduMate</h1>
          <p>
            Your smart study planner to organize tasks, manage time,
            and achieve academic goals easily.
          </p>
        </div>
      </div>

      <div className="right-section">
        <div className="form-box">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">
            Login to continue your learning journey.
          </p>

          <form>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>

          <div className="bottom-text">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}