import { useState } from "react";
import { useNavigate} from "react-router-dom";
import "./styles.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Informe o e-mail.");
      return;
    }
    navigate("/change-password");
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
          <button type="submit">Recuperar</button>
      </form>
      <p>
        <span
          onClick={() => navigate("/")}
        >
          Voltar para Login
        </span>
      </p>
    </div>
  );
}

export default ForgotPassword;
