import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Register(){
    const [form, setForm] = useState({ name: "", email: "" });
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", form);
        //navigate('/');
      };

    return (
    <div className="register-page">
        <h2>Cadastra-se</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nome"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Cadastrar</button>
        </form>
        <p>
        Já possui uma conta?{" "}
        <span
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
    )
}
export default Register;