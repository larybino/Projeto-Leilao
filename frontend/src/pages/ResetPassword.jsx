import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import personService from "../service/PersonService";
import './styles.css';

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await personService.resetPassword({ code, newPassword });
      toast.success("Senha alterada com sucesso! Agora você pode fazer o login.");
      navigate("/login"); 
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      const errorMessage = error.response?.data?.message || "Código inválido ou expirado. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
        <h2>Redefinir Senha</h2>
        <form onSubmit={handleSubmit}>
            <input
              id="code"
              type="text"
              placeholder="Insira o código recebido por e-mail"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              id="newPassword"
              type="password"
              placeholder="Crie uma nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          <button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'A alterar...' : 'Alterar Senha'}
          </button>
        </form>
        <p>
          <Link to="/login">
            Voltar para o Login
          </Link>
        </p>
      </div>
  );
}

export default ResetPassword;
