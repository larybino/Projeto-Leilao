// pages/ChangePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const passwordRules = {
  length: { regex: /.{6,}/, message: "Mínimo de 6 caracteres" },
  uppercase: { regex: /[A-Z]/, message: "Pelo menos uma letra maiúscula" },
  lowercase: { regex: /[a-z]/, message: "Pelo menos uma letra minúscula" },
  number: { regex: /[0-9]/, message: "Pelo menos um número" },
  special: { regex: /[\W_]/, message: "Pelo menos um caractere especial" },
};

function ChangePassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const newErrors = Object.values(passwordRules)
      .filter((rule) => !rule.regex.test(value))
      .map((rule) => rule.message);
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (errors.length === 0) {
      alert("Senha alterada com sucesso!");
    }
  };

  return (
    <div className="change-password-page">
      <h2>Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="E-mail"
          required
        />
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Código"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nova Senha"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirmar Senha"
          required
        />

        <ul className="validation-list">
          {Object.values(passwordRules).map((rule) => (
            <li
              key={rule.message}
              className={rule.regex.test(form.password) ? "valid" : "invalid"}
            >
              {rule.message}
            </li>
          ))}
        </ul>
        <button type="submit">Alterar Senha</button>
        <button type="button" onClick={() => navigate("/")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
