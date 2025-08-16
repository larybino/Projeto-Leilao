import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './styles.css';
import PersonService from "../service/PersonService";
import { toast } from 'react-toastify';

function Register(){
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await PersonService.create(form);
            toast.success("Cadastro realizado com sucesso! Agora você pode fazer o login.");
            navigate('/login'); 
        } catch (error) {
            console.error("Erro no cadastro:", error);
            const errorMessage = error.response?.data?.message || "Falha no cadastro. Verifique seus dados.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
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
            <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        </form>
        <p>
        Já possui uma conta?{" "}
        <span
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
    )
}
export default Register;