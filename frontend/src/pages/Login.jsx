import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import "./styles.css";
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(form);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("usuario", JSON.stringify(response.data));
        toast.current.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Login efetuado! Redirecionando...",
          life: 2000,
        });
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login falhou. Verifique suas credenciais.";
      toast.current.show({
        severity: "error",
        summary: "Erro de Autenticação",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const cardFooter = (
    <div>
      <Divider />
      <div>
        <Button
          label="Não possui uma conta? Cadastre-se"
          link
          onClick={() => navigate("/register")}
        />
        <Button
          label="Esqueceu a senha?"
          link
          onClick={() => navigate("/forgot-password")}
        />
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <Toast ref={toast} />
      <Card
        title="Login"
        style={{ width: "100%", maxWidth: "400px" }}
        footer={cardFooter}
      >
        <form onSubmit={handleSubmit}>
          <span className="p-float-label">
            <InputText
              className="input"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
            <label htmlFor="email">Email</label>
          </span>

          <span className="p-float-label">
            <Password
              className="input-password"
              inputId="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              toggleMask
              required
              feedback={false}
            />
            <label htmlFor="password">Senha</label>
          </span>

          <Button
            label="Entrar"
            className="btn"
            type="submit"
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
}

export default Login;
