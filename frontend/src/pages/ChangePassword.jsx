import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import personService from "../service/PersonService";

const passwordRules = [
    { regex: /.{6,}/, message: "Mínimo de 6 caracteres" },
];

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
        return passwordRules.every(rule => rule.regex.test(password));
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (!isPasswordValid(form.newPassword)) {
      toast.error("A nova senha não atende a todos os critérios de segurança.");
      return;
    }

    setLoading(true);
    try {
      await personService.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success(
        "Senha alterada com sucesso! Por favor, faça o login novamente."
      );
      navigate("/login");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      const errorMessage =
        error.response?.data?.message || "Não foi possível alterar a senha.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h2>Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
          placeholder="Senha Antiga"
          required
        />
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
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
          {passwordRules.map((rule) => (
            <li
              key={rule.message}
              className={rule.regex.test(form.password) ? "valid" : "invalid"}
            >
              {rule.regex.test(form.newPassword) ? "✓" : "✗"} {rule.message}
            </li>
          ))}
        </ul>
        <button type="submit" disabled={loading}>
          {loading ? "Alterando..." : "Alterar Senha"}
        </button>
        <button type="button" onClick={() => navigate("/home")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
