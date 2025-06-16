import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [error, setError] = useState<string>('');
    const nav = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const formData = Object.fromEntries(form);

            const req = await fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.ok) {
                nav('/');
            } else {
                console.error("Login failed:", res.error);
                setError(res.error || "An unknown error occurred during login.");
            };
        } catch (e) {
            console.error("Error during login:", e);
        };
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <h2>Welcome back.</h2>

            <div>
                <label htmlFor="email">Email:</label>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    minLength={8}
                    required
                />
            </div>

            {error && (
                <p className="error">{error}</p>
            )}

            <button className="primary" type="submit">Login</button>

            <p>
                Don't have an account?
                <Link
                    className="text-primary hover:text-secondary focus-visible:text-secondary underline"
                    to='/signup'>
                    &nbsp;Sign Up
                </Link>
            </p>
        </form>
    );
};

export default Login;