import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import "./styles.css";
import imgService from "../service/ImgService";

function ImgListPage() {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImagens = async () => {
      try {
        const response = await imgService.getAll();
        setImagens(response.data.content || []);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao buscar as imagens.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchImagens();
  }, []);

  const handleDelete = async (id) => {
    try {
      await imgService.delete(id);
      setImagens(imagens.filter((i) => i.id !== id));
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Imagem removida com sucesso!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao remover a imagem.",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Tem a certeza que deseja remover esta imagem?",
      header: "Confirmação de Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim, remover",
      rejectLabel: "Não",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action">
        <React.Fragment>
          <Button
            icon="pi pi-pencil"
            rounded
            className="p-button-text p-button-success mr-2"
            onClick={() => navigate(`/imagens/${rowData.id}`)} 
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
          />
          <Button
            icon="pi pi-trash"
            rounded
            className="p-button-text p-button-danger"
            onClick={() => confirmDelete(rowData.id)}
            tooltip="Excluir"
            tooltipOptions={{ position: "top" }}
          />
        </React.Fragment>
      </div>
    );
  };

  const leftToolbarTemplate = () => (
    <h1 style={{ margin: 0 }}>Gerenciar Imagens</h1>
  );

  const rightToolbarTemplate = () => (
    <Button
      label="Adicionar Imagem"
      icon="pi pi-plus"
      className="btn-add"
      onClick={() => navigate("/imagens/novo")}
    />
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>

      <DataTable
        value={imagens}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="Nenhuma imagem encontrada."
        responsiveLayout="scroll"
        dataKey="id"
      >
        <Column
          field="dateTime"
          header="Data e Hora"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="url"
          header="URL"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          header="Ações"
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "8rem", textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default ImgListPage;
