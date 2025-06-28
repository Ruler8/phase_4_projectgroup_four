import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || form.password !== form.confirm) {
      setError("Passwords must match and all fields are required.");
    } else {
      localStorage.setItem("token", "dummy-token");
      navigate("/dashboard");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl mb-4 font-semibold text-center">Register</h2>
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
      <input
        name="confirm"
        type="password"
        placeholder="Confirm Password"
        value={form.confirm}
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
    </form>
  );
}
