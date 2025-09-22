import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import personService from "../service/PersonService";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await personService.recoverPassword({ email });
      toast.success(
        "Se o e-mail estiver registado, receberá um código de recuperação."
      );
      navigate("/reset-password");
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Recuperar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando" : "Enviar E-mail de Recuperação"}
        </button>
      </form>
      <p>
        <span onClick={() => navigate("/login")}>Voltar para Login</span>
      </p>
    </div>
  );
}

export default ForgotPassword;
