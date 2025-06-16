import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [error, setError] = useState<string>('');
    const nav = useNavigate();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const formData = Object.fromEntries(form);

            const req = await fetch('/api/user/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.ok) {
                nav('/login');
            } else {
                console.error("Sign up failed:", res.error);
                setError(res.error || "An unknown error occurred during sign up.");
            };
        } catch (e) {
            console.error("Error during sign up:", e);
        };
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <h2>Create account</h2>

            <div>
                <label htmlFor="username">Create username:</label>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                />
            </div>

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

            <button className="primary" type="submit">Sign Up</button>

            <p>
                Already have an account?
                <Link
                    className="text-primary hover:text-secondary focus-visible:text-secondary underline"
                    to='/login'>
                    &nbsp;Login
                </Link>
            </p>
        </form>
    );
};

export default Signup;