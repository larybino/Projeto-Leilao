import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    //navigate('/');
  };

  return (
    <div className="login-page">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Não possui uma conta?{" "}
        <span
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
      <p>
        <span
          onClick={() => navigate("/forgot-password")}
        >
          Esqueceu a senha?
        </span>
      </p>
    </div>
  );
}

export default Login;
