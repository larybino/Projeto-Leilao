import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import AuthService from "../service/AuthService";

function Login() {
  const authService = new AuthService();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    //navigate('/');
     try {
      const respons = await authService.login(form);
      console.log("Response:", respons);
      if (respons.status === 200 && respons.data.token) {
        localStorage.setItem("usuario", JSON.stringify(respons.data));
        navigate("/home");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
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
        <button type="submit">
          Login
        </button>
      </form>
      <p>
        Não possui uma conta?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
      <p>
        <span onClick={() => navigate("/forgot-password")}>
          Esqueceu a senha?
        </span>
      </p>
    </div>
  );
}

export default Login;
