import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../service/CategoryService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data.content || []);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao buscar categorias.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Categoria removida!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao remover a categoria.",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Tem certeza que deseja remover esta categoria?",
      header: "Confirmação de Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => handleDelete(id),
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          className="p-button-text p-button-success mr-2"
          onClick={() => navigate(`/categorias/${rowData.id}`)} // Rota para editar categoria
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
    );
  };

  const leftToolbarTemplate = () => (
    <h1 style={{ margin: 0 }}>Gerenciar Categorias</h1>
  );

  const rightToolbarTemplate = () => (
    <Button
      label="Nova"
      icon="pi pi-plus"
      className="btn-add"
      onClick={() => navigate("/categorias/novo")}
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
        value={categories}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="Nenhuma categoria cadastrada."
        responsiveLayout="scroll"
        dataKey="id"
      >
        <Column
          field="id"
          header="ID"
          sortable
          style={{ maxWidth: "8rem" }}
        ></Column>
        <Column
          field="name"
          header="Nome"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="obs"
          header="Observação"
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          header="Ações"
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "8rem", textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default CategoryListPage;
