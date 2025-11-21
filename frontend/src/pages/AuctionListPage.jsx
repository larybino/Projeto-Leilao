import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import auctionService from "../service/AuctionService";
import { useAuth } from "../service/AuthContext";
import categoryService from "../service/CategoryService";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

const statusOptions = [
  { label: "Aberto", value: "OPEN" },
  { label: "Em Andamento", value: "IN_PROGRESS" },
  { label: "Encerrado", value: "CLOSED" },
  { label: "Cancelado", value: "CANCELED" },
];

const statusMap = Object.fromEntries(statusOptions.map(s => [s.value, s.label]));

function AuctionListPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    title: '',
    status: null,
    categoryId: null,
    startDate: null,
    endDate: null,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(response => {
        const categoryOptions = response.data.content.map(cat => ({ label: cat.name, value: cat.id }));
        setCategories(categoryOptions);
    });
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const apiFilters = {
            ...filters,
            startDate: filters.startDate ? filters.startDate.toISOString() : null,
            endDate: filters.endDate ? filters.endDate.toISOString() : null,
        };
        const response = await auctionService.getAll(apiFilters);
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
  }, [filters]);

  const handleFilterChange = (e, name) => {
    setFilters(prevFilters => ({
        ...prevFilters,
        [name]: e.value
    }));
  };
  
  const clearFilters = () => {
    setFilters({ title: '', status: null, categoryId: null, startDate: null, endDate: null });
  };

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
    // const isOwner = user?.id === rowData.seller?.id;
    // const isAdmin = user?.roles?.includes('ADMIN');

    // if (!isOwner && !isAdmin) {
    //     return null; 
    // }

    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          className="btn-edit"
          onClick={() => navigate(`/leiloes/${rowData.id}`)}
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          className="btn-delete"
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
      label="Novo"
      icon="pi pi-plus"
      className="btn-add"
      onClick={() => navigate("/leiloes/novo")}
    />
  );

  const filterBar = (
    <div className="p-grid p-fluid p-mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div className="p-col-12 p-md-3">
            <span className="p-float-label">
                <InputText id="title" value={filters.title} onChange={(e) => setFilters({...filters, title: e.target.value})} />
                <label htmlFor="title">Título</label>
            </span>
        </div>
        <div className="p-col-12 p-md-2">
            <Dropdown value={filters.status} options={statusOptions} onChange={(e) => handleFilterChange(e, 'status')} placeholder="Status" showClear />
        </div>
        <div className="p-col-12 p-md-2">
            <Dropdown value={filters.categoryId} options={categories} onChange={(e) => handleFilterChange(e, 'categoryId')} placeholder="Categoria" showClear />
        </div>
        <div className="p-col-12 p-md-2">
            <Calendar value={filters.startDate} onChange={(e) => handleFilterChange(e, 'startDate')} placeholder="Data Início" dateFormat="dd/mm/yy" />
        </div>
        <div className="p-col-12 p-md-2">
            <Calendar value={filters.endDate} onChange={(e) => handleFilterChange(e, 'endDate')} placeholder="Data Fim" dateFormat="dd/mm/yy" />
        </div>
        <div className="p-col-12 p-md-1">
            <Button label="Limpar" icon="pi pi-filter-slash" className="btn-save" onClick={clearFilters} />
        </div>
    </div>
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

      <div className="card">
        {filterBar}
      </div>

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
          body={(row) => statusMap[row.status] || row.status}
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
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "8rem"}}
        ></Column>
      </DataTable>
    </div>
  );
}

export default AuctionListPage;
