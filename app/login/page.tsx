import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container">
      <div className="form-box">
        <h2>Login</h2>

        <form>
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

          <button type="submit">Login</button>
        </form>

        <div className="link-text">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}