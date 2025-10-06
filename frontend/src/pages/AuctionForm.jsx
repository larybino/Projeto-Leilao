import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import auctionService from "../service/AuctionService";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import categoryService from "../service/CategoryService";

const statusOptions = [
  { label: "Aberto", value: "OPEN" },
  { label: "Em Andamento", value: "IN_PROGRESS" },
  { label: "Encerrado", value: "CLOSED" },
  { label: "Cancelado", value: "CANCELED" },
];

function AuctionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailsDescription, setDetailsDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("OPEN");
  const [obs, setObs] = useState("");
  const [incrementValue, setIncrementValue] = useState("");
  const [minBid, setMinBid] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    categoryService
      .getAll()
      .then((response) => {
        const categoryOptions = response.data.content.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(categoryOptions);
      })
      .catch(() => {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar as categorias.",
        });
      });
  }, []);

  useEffect(() => {
    if (isEditing) {
      auctionService
        .getById(id)
        .then((response) => {
          const data = response.data;
          setTitle(data.title || "");
          setDescription(data.description || "");
          setDetailsDescription(data.detailsDescription || "");
          setStartDate(data.startDate ? new Date(data.startDate) : null);
          setEndDate(data.endDate ? new Date(data.endDate) : null);
          setStatus(data.status || null);
          setObs(data.obs || "");
          setIncrementValue(data.incrementValue || "");
          setMinBid(data.minBid || "");
          setCategoryId(data.category?.id || null);
        })
        .catch(() => {
          toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: "Leilão não encontrado.",
            life: 3000,
          });
          navigate("/leiloes");
        })
        .finally(() => {
          setPageLoading(false);
          setVisible(true);
        });
    } else {
      setVisible(true);
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !categoryId) {
      toast.current.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Título, descrição e categoria são obrigatórios.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    const auctionData = {
      title,
      description,
      detailsDescription,
      startDate,
      endDate,
      status,
      obs,
      incrementValue: parseFloat(incrementValue) || 0,
      minBid: parseFloat(minBid) || 0,
      category: { id: categoryId },
    };

    try {
      if (isEditing) {
        await auctionService.update(id, auctionData);
      } else {
        await auctionService.create(auctionData);
      }

      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Leilão ${isEditing ? "atualizado" : "criado"} com sucesso!`,
        life: 3000,
      });
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Ocorreu um erro ao ${isEditing ? "atualizar" : "criar"} o leilão.`;
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
    navigate("/leiloes");
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
        <label htmlFor="title">Título</label>
        <InputText
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Descrição</label>
        <InputText
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="category">Categoria</label>
        <Dropdown
          id="category"
          value={categoryId}
          options={categories}
          onChange={(e) => setCategoryId(e.value)}
          placeholder="Selecione a categoria"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="detailsDescription">Detalhes</label>
        <InputText
          id="detailsDescription"
          value={detailsDescription}
          onChange={(e) => setDetailsDescription(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="startDate">Data de Início</label>
        <Calendar
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.value)}
          showTime
          dateFormat="dd/mm/yy"
        />
      </div>

      <div className="field">
        <label htmlFor="endDate">Data de Término</label>
        <Calendar
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.value)}
          showTime
          dateFormat="dd/mm/yy"
        />
      </div>

      <div className="field">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          value={status}
          options={statusOptions}
          onChange={(e) => setStatus(e.value)}
          placeholder="Selecione o status"
        />
      </div>

      <div className="field">
        <label htmlFor="obs">Observação</label>
        <InputText
          id="obs"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="incrementValue">Valor Incrementado</label>
        <InputText
          id="incrementValue"
          value={incrementValue}
          onChange={(e) => setIncrementValue(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="minBid">Lance Mínimo</label>
        <InputText
          id="minBid"
          value={minBid}
          onChange={(e) => setMinBid(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header={isEditing ? "Editar Leilão" : "Adicionar Novo Leilão"}
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

export default AuctionForm;
