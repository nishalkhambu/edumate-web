import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="login-container">
      <div className="left-section">
        <div className="overlay">
          <h1>Join EduMate</h1>
          <p>
            Create your account and start planning your studies smarter,
            tracking goals, and improving productivity every day.
          </p>
        </div>
      </div>

      <div className="right-section">
        <div className="form-box">
          <h2>Create Account ✨</h2>
          <p className="subtitle">
            Register to begin your smart learning experience.
          </p>

          <form>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create password"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                required
              />
            </div>

            <button type="submit">Register</button>
          </form>

          <div className="bottom-text">
            <p>
              Already have an account?{' '}
              <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
