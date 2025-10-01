import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import categoryService from "../service/CategoryService";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [visible, setVisible] = useState(true); 
  
  useEffect(() => {
    if (isEditing) {
      categoryService.getById(id)
        .then((response) => {
          setName(response.data.name);
          setObs(response.data.obs);
        })
        .catch(() => {
          toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: "Categoria não encontrada.",
            life: 3000,
          });
          navigate("/categoria");
        })
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing, navigate]);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
        toast.current.show({
            severity: "warn",
            summary: "Atenção",
            detail: "O nome da categoria é obrigatório.",
            life: 3000,
        });
        return;
    }

    setLoading(true);

    try {
        if (isEditing) {
            await categoryService.update(id, { name, obs });
        } else {
            await categoryService.create({ name, obs });
        }

        toast.current.show({
            severity: "success",
            summary: "Sucesso",
            detail: `Categoria ${isEditing ? "atualizada" : "criada"} com sucesso!`,
            life: 3000,
        });
        closeModal();
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            `Ocorreu um erro ao ${isEditing ? "atualizar" : "criar"} a categoria.`;
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
    navigate("/categorias");
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
        <label htmlFor="name">Nome</label>
        <InputText
          className="input"
          id="nameCategory"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <label htmlFor="obs">OBS</label>
        <InputText
          className="input"
          id="obsCategory"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={isEditing ? "Editar Categoria" : "Adicionar Nova Categoria"}
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

export default CategoryForm;
