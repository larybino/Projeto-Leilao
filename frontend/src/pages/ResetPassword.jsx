import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import personService from "../service/PersonService";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "As senhas não coincidem.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await personService.resetPassword({ code, newPassword });
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Senha alterada! Você será redirecionado.",
        life: 3000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Código inválido ou expirado. Tente novamente.";
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const cardFooter = (
    <div>
      <Button
        label="Voltar para o Login"
        link
        onClick={() => navigate("/login")}
      />
    </div>
  );

  return (
    <div className="reset-password-page">
      <Toast ref={toast} />
      <Card
        title="Redefinir Senha"
        style={{ width: "100%", maxWidth: "450px" }}
        footer={cardFooter}
      >
        <form onSubmit={handleSubmit} className="form-content">

          <span className="p-float-label">
            <InputText
              className="input"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="code">Código recebido por e-mail</label>
          </span>

          <span className="p-float-label">
            <Password
              className="input-password"
              inputId="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              toggleMask
              required
              feedback={false}
            />
            <label htmlFor="newPassword">Nova senha</label>
          </span>

          <span className="p-float-label">
            <Password
              className="input-password"
              inputId="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              toggleMask
              required
              feedback={false}
            />
            <label htmlFor="confirmPassword">Repita a nova senha</label>
          </span>

          <Button
            className="btn"
            type="submit"
            label="Alterar Senha"
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
}

export default ResetPassword;
