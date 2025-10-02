import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Calendar } from "primereact/calendar";
import imgService from "../service/ImgService";

function ImgFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const isEditing = Boolean(id);

  const [dateTime, setDateTime] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (isEditing) {
      imgService
        .getById(id)
        .then((response) => {
          setDateTime(response.data.dateTime);
          setUrl(response.data.url);
        })
        .catch(() => {
          toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: "Imagem não encontrada.",
            life: 3000,
          });
          navigate("/imagens");
        })
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateTime) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "A data e hora da imagem são obrigatórias.",
        life: 3000,
      });
      return;
    }

    if (!url.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "A URL da imagem é obrigatória.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    const formattedDate =
      dateTime instanceof Date ? dateTime.toISOString() : dateTime;

    const imgData = isEditing
      ? { id: parseInt(id), dateTime: formattedDate, url }
      : { dateTime: formattedDate, url };

    console.log("Enviando imgData:", imgData);

    const action = isEditing
      ? imgService.update(imgData.id, imgData)
      : imgService.create(imgData);

    try {
      await action;
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Imagem ${isEditing ? "atualizada" : "criada"} com sucesso!`,
        life: 3000,
      });
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Ocorreu um erro ao ${isEditing ? "atualizar" : "criar"} a imagem.`;
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
    navigate("/imagens");
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
        <label htmlFor="dateTime">Data e Hora</label>
        <Calendar
          id="dateTime"
          value={dateTime}
          onChange={(e) => setDateTime(e.value)}
          showTime
          dateFormat="dd/mm/yy"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="url">URL da Imagem</label>
        <InputText
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={isEditing ? "Editar Imagem" : "Adicionar Nova Imagem"}
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

export default ImgFormPage;
