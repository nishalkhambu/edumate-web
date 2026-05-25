import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="container">
      <div className="form-box">
        <h2>Register</h2>

        <form>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="link-text">
          <p>
            Already have an account?{" "}
            <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}