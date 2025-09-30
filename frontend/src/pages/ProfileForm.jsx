import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileService from "../service/ProfileService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

function ProfileFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const isEditing = Boolean(id);

  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [visible, setVisible] = useState(true); // controla a abertura do modal

  useEffect(() => {
    if (isEditing) {
      ProfileService.getById(id)
        .then((response) => {
          setType(response.data.type);
        })
        .catch(() => {
          toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: "Perfil não encontrado.",
            life: 3000,
          });
          navigate("/profile");
        })
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "O nome do perfil é obrigatório.",
        life: 3000,
      });
      return;
    }
    setLoading(true);

    const profileData = isEditing ? { id: parseInt(id), type } : { type };

    const action = isEditing
      ? ProfileService.update(profileData)
      : ProfileService.create(profileData);

    try {
      await action;
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Perfil ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        life: 3000,
      });
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Ocorreu um erro ao ${isEditing ? "atualizar" : "criar"} o perfil.`;
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

  const closeModal = () => {
    setVisible(false);
    navigate("/profile"); // redireciona ao fechar
  };

  const renderFooter = () => (
    <div className="flex justify-content-end gap-2">
      <Button
        className="btn-cancel"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        outlined
        onClick={closeModal}
        disabled={loading}
      />
      <Button
        className="btn-save"
        label={isEditing ? "Salvar" : "Criar"}
        icon="pi pi-check"
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );

  const formContent = (
    <div className="p-fluid">
      <div className="field">
        <label htmlFor="profileType">Nome do Perfil</label>
        <InputText
          className="input"
          id="profileType"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          autoFocus
        />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={isEditing ? "Editar Perfil" : "Adicionar Novo Perfil"}
        visible={visible}
        style={{ width: "400px" }}
        footer={renderFooter()}
        onHide={closeModal}
      >
        {pageLoading ? (
          <div className="flex justify-content-center p-5">
            <ProgressSpinner />
          </div>
        ) : (
          formContent
        )}
      </Dialog>
    </div>
  );
}

export default ProfileFormPage;
