import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PersonService from "../service/PersonService";
import ProfileService from "../service/ProfileService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import "./styles.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profileIds: [],
  });
  const [perfils, setPerfils] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await ProfileService.getAll();
        setPerfils(response.data.content || []);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao buscar perfis.",
          life: 3000,
        });
      }
    };
    fetchPerfis();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await PersonService.register(form);
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Cadastro realizado! Você será redirecionado.",
        life: 3000,
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Falha no cadastro. Verifique seus dados.";
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

  const passwordHeader = <div className="font-bold mb-2">Crie sua senha</div>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Sugestões</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Pelo menos uma letra minúscula</li>
        <li>Pelo menos uma letra maiúscula</li>
        <li>Pelo menos um número</li>
        <li>Mínimo de 8 caracteres</li>
      </ul>
    </>
  );

  const cardFooter = (
    <div>
      <Divider />
      <div>
        <Button label="Faça o Login" link onClick={() => navigate("/login")} />
      </div>
    </div>
  );


  return (
    <div className="register-page">
      <Toast ref={toast} />
      <Card
        title="Cadastrar-se"
        style={{ width: "100%", maxWidth: "450px" }}
        footer={cardFooter}
      >
        <form onSubmit={handleSubmit} className="form-content">
          <span className="p-float-label">
            <InputText
              className="input"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
            <label htmlFor="name">Nome Completo</label>
          </span>

          <span className="p-float-label">
            <InputText
              className="input"
              id="email"
              name="email"
              keyfilter="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </span>

          <span className="p-float-label">
            <Password
              className="input-password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              toggleMask
              required
              header={passwordHeader}
              footer={passwordFooter}
              promptLabel="Digite uma senha"
              weakLabel="Fraca"
              mediumLabel="Média"
              strongLabel="Forte"
            />
            <label htmlFor="password">Senha</label>
          </span>

          <Button
            type="submit"
            className="btn"
            label="Cadastrar"
            loading={loading}
          />
        </form>
      </Card>
    </div>
  );
}

export default Register;
