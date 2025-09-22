import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PersonService from "../service/PersonService";
import ProfileService from "../service/ProfileService";
import { toast } from 'react-toastify';
import './styles.css';

function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", profileIds: [] });
    const [perfils, setPerfils] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        ProfileService.getAll()
            .then(response => setPerfils(response.data.content || []))
            .catch(() => toast.error("Falha ao buscar perfis."));
    }, []);

    const handleChange = (e) => {
        const { name, value, options } = e.target;

        if (name === "profileIds") {
            const selectedIds = Array.from(options).filter(o => o.selected).map(o => parseInt(o.value));
            setForm({ ...form, profileIds: selectedIds });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await PersonService.register(form);
            toast.success("Cadastro realizado com sucesso! Agora você pode fazer o login.");
            navigate('/login'); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Falha no cadastro. Verifique seus dados.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <h2>Cadastrar-se</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input type="text" name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Senha" value={form.password} onChange={handleChange} required />

                <label>Selecione o(s) perfil(is):</label>
                <select
                    name="profileIds"
                    multiple
                    value={form.profileIds}
                    onChange={handleChange}
                    className="select-multiple"
                >
                    {perfils.map(p => (
                        <option key={p.id} value={p.id}>{p.type}</option>
                    ))}
                </select>

                <button type="submit" disabled={loading}>{loading ? 'Cadastrando' : 'Cadastrar'}</button>
            </form>
            <p className="login-link">
                Já possui conta? <span onClick={() => navigate("/login")}>Login</span>
            </p>
        </div>
    );
}

export default Register;
