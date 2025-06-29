import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ isAdmin = false }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email && form.password) {
      localStorage.setItem("token", "dummy-token");

      // Redirect to correct dashboard
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl mb-4 font-semibold text-center">
        {isAdmin ? "Admin Login" : "User Login"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isAdmin ? "Login as Admin" : "Login as User"}
      </button>
    </form>
  );
}
