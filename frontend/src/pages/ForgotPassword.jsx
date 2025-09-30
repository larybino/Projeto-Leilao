import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import personService from "../service/PersonService";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await personService.recoverPassword({ email });
      toast.current.show({
        severity: "success",
        summary: "Verifique seu E-mail",
        detail:
          "Se o e-mail estiver registrado, você receberá um código de recuperação.",
        life: 5000,
      });
      setTimeout(() => navigate("/reset-password"), 3000);
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      toast.current.show({
        severity: "success",
        summary: "Verifique seu E-mail",
        detail:
          "Se o e-mail estiver registrado, você receberá um código de recuperação.",
        life: 5000,
      });
      setTimeout(() => navigate("/reset-password"), 3000);
    } finally {
      setTimeout(() => setLoading(false), 2500);
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
    <div className="forgot-password-page">
      <Toast ref={toast} />
      <Card
        title="Recuperar Senha"
        subTitle="Digite seu e-mail para receber o código de recuperação"
        style={{ width: "100%", maxWidth: "450px" }}
        footer={cardFooter}
      >
        <form
          onSubmit={handleSubmit}
          className="p-fluid flex flex-column gap-4"
        >
          <span className="p-float-label">
            <InputText
              className="input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="email">Digite seu e-mail</label>
          </span>
          <Button
            className="btn"
            type="submit"
            label="Enviar E-mail de Recuperação"
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
}

export default ForgotPassword;
