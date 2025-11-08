import { useState, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Checkbox } from "primereact/checkbox";
import auctionService from "../service/AuctionService";
import categoryService from "../service/CategoryService";
import "./styles.css";
import { useNavigate } from "react-router-dom";

function PublicAuctionsPage() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState("endDate,asc");
  const [showPast, setShowPast] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [totalRecords, setTotalRecords] = useState(0);

  const sortOptions = [
    { label: "Termina em breve", value: "endDate,asc" },
    { label: "Mais recentes", value: "startDate,desc" },
  ];

  const fetchData = () => {
    setLoading(true);
    setError(null);
    const filters = {
      title: searchTerm,
      categoryId: selectedCategory,
      showPast,
    };
    const page = first / rows;

    auctionService
      .getPublicAuctions(filters, page, rows, sortOption)
      .then((response) => {
        setAuctions(response.data.content);
        setTotalRecords(response.data.totalElements);
      })
      .catch((err) =>
        setError(
          "Não foi possível carregar os leilões. Tente novamente mais tarde."
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoryService.getAll().then((res) => {
      const categoryOptions = res.data.content.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
      setCategories(categoryOptions);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortOption, showPast, first, rows]);

  const renderGridItem = (data) => {
    return (
      <div className="col-12 md:col-4">
        <div className="auction-card">
          <img
            className="auction-image"
            src={
              data.coverImageUrl ||
              "https://via.placeholder.com/300x200?text=Sem+Imagem"
            }
            alt={`Imagem do leilão ${data.title}`}
          />
          <div className="auction-details">
            <div className="auction-category">
              {data.categoryName || "Sem Categoria"}
            </div>
            <h5 className="auction-title">{data.title}</h5>
            <div className="auction-end-date">
              Termina em:{" "}
              {new Date(data.endDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="auction-price">
              A partir de R$ {data.currentPrice.toFixed(2)}
            </div>
            <Button
              label="Ver detalhes"
              icon="pi pi-arrow-right"
              className="p-button-text p-mb-4"
              onClick={() => navigate(`/leilao/publico/${data.id}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter align-items-center">
        <div className="col-12 md:col-4">
          <div className="relative">
            <span className="p-input-icon-left px-5">
              <i className="pi pi-search absolute top-50 -mt-2 px-2 text-gray-400" />
              <InputText
                type="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título..."
                className="px-5"
              />
            </span>
          </div>
        </div>
        <div className="col-12 md:col-2">
          <Dropdown
            value={selectedCategory}
            options={categories}
            onChange={(e) => setSelectedCategory(e.value)}
            placeholder="Categoria"
            showClear
            className="w-full"
          />
        </div>
        <div className="col-12 md:col-2">
          <Dropdown
            value={sortOption}
            options={sortOptions}
            onChange={(e) => setSortOption(e.value)}
            className="w-full"
          />
        </div>
        <div className="col-12 md:col-4 flex align-items-center justify-content-end">
          <Checkbox
            inputId="showPast"
            checked={showPast}
            onChange={(e) => setShowPast(e.checked)}
          />
          <label htmlFor="showPast" className="ml-2">
            Mostrar leilões encerrados
          </label>
        </div>
      </div>
    );
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  if (error) {
    return (
      <div className="error-message">
        {error} <Button label="Tentar novamente" onClick={fetchData} />
      </div>
    );
  }

  return (
    <>
      <main className="public-auctions-page">
        <header className="page-header">
          <h1>Leilões Disponíveis</h1>
        </header>
        <div className="card">
          <DataView
            value={loading ? new Array(6).fill({}) : auctions}
            layout="grid"
            header={renderHeader()}
            itemTemplate={
              loading
                ? (item) => (
                    <div className="col-12 md:col-4">
                      <Skeleton height="350px" className="mb-2"></Skeleton>
                    </div>
                  )
                : renderGridItem
            }
            emptyMessage="Nenhum leilão disponível com os filtros selecionados."
          />
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            rowsPerPageOptions={[9, 12, 24]}
            onPageChange={onPageChange}
          />
        </div>
      </main>
    </>
  );
}

export default PublicAuctionsPage;
