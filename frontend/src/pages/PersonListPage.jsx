import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import personService from "../service/PersonService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import "./styles.css";
import { useAuth } from "../service/AuthContext";
import { InputText } from "primereact/inputtext";

function PersonListPage() {
  const { user } = useAuth();
  console.log("Objeto de usuário atual:", user);
  const isAdmin = user && user.roles && user.roles.includes("ADMIN");
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const response = await personService.getAll(debouncedSearchTerm);
        setPessoas(response.data.content || []);
      } catch (error) {
        let detail = "Falha ao buscar pessoas.";
        if (error.response?.status === 403) {
          detail = "Você não tem permissão para ver esta lista.";
        }
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail,
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPessoas();
  }, [debouncedSearchTerm, isAdmin]);

  const handleDelete = async (id) => {
    try {
      await personService.delete(id);
      setPessoas(pessoas.filter((p) => p.id !== id));
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Pessoa removida!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao remover a pessoa.",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Tem certeza que deseja remover esta pessoa?",
      header: "Confirmação de Exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => handleDelete(id),
    });
  };

  const profilesBodyTemplate = (rowData) => {
    if (rowData.personProfile && rowData.personProfile.length > 0) {
      return rowData.personProfile.map((pp) => pp.profile?.type).join(", ");
    }
    return "—";
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="btn-edit"
          onClick={() => navigate(`/pessoas/${rowData.id}`)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          className="btn-delete"
          onClick={() => confirmDelete(rowData.id)}
          tooltip="Excluir"
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
        className="input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar nome ou email..."
      />
    </span>
  );

  const leftToolbarTemplate = () => (
    <h1 className="page-title">Gerenciar Pessoas</h1>
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="person-list-box">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />

        <DataTable
          value={pessoas}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="Nenhuma pessoa cadastrada."
          responsiveLayout="scroll"
          dataKey="id"
          className="person-table"
        >
          <Column
            field="name"
            header="Nome"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="email"
            header="Email"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            header="Perfis"
            body={profilesBodyTemplate}
            style={{ minWidth: "10rem" }}
          />
          <Column
            header="Ações"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem", textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
}

export default PersonListPage;
