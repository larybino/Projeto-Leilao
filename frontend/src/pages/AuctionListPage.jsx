import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import auctionService from "../service/AuctionService";

function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await auctionService.getAll();
        setAuctions(response.data.content || []);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao buscar leilões.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await auctionService.delete(id);
      setAuctions(auctions.filter((c) => c.id !== id));
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Leilão removido!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao remover o leilão.",
        life: 3000,
      });
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Tem certeza que deseja remover este leilão?",
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
          onClick={() => navigate(`/leiloes/${rowData.id}`)}
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
    <h1 style={{ margin: 0 }}>Gerenciar Leilões</h1>
  );

  const rightToolbarTemplate = () => (
    <Button
      label="Nova"
      icon="pi pi-plus"
      className="btn-add"
      onClick={() => navigate("/leiloes/novo")}
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
        value={auctions}
        loading={loading}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="Nenhum leilão cadastrado."
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
          field="title"
          header="Título"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="description"
          header="Descrição"
          style={{ minWidth: "16rem" }}
        ></Column>
        <Column
          field="detailsDescription"
          header="Detalhes"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>

        <Column
          field="startDate"
          header="Data de Início"
          body={(rowData) => new Date(rowData.startDate).toLocaleString()}
          sortable
        />
        <Column
          field="endDate"
          header="Data de Término"
          body={(rowData) => new Date(rowData.endDate).toLocaleString()}
          sortable
        />
        <Column
          field="status"
          header="Status"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="obs"
          header="Observação"
          sortable
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="incrementValue"
          header="Valor Incrementado"
          body={(rowData) => rowData.incrementValue?.toFixed(2) || "-"}
          sortable
        />
        <Column
          field="minBid"
          header="Lance Mínimo"
          body={(rowData) => rowData.minBid?.toFixed(2) || "-"}
          sortable
        />
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

export default AuctionListPage;
