import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Galleria } from "primereact/galleria";
import { Rating } from "primereact/rating";
import auctionService from "../service/AuctionService";
import { formatCurrencyBRL, formatDateBRL } from "../utils/formatters";
import "./styles.css";
import { useAuth } from "../service/AuthContext";
import AuctionBidComponent from "./AuctionBidComponent";

function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const statusLabel = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em Andamento",
    CLOSED: "Encerrado",
    CANCELED: "Cancelado",
  };

  useEffect(() => {
    
      auctionService
        .getPublicAuctionById(id)
        .then((response) => {
          setAuction(response.data);
          document.title = `${response.data.title} — App Leilão`;
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setError("Leilão não encontrado.");
          } else {
            setError("Ocorreu um erro ao carregar o leilão.");
          }
        })
        .finally(() => setLoading(false));
    
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!auction) {
    return <div className="error-message">Leilão não encontrado.</div>;
  }

  const itemTemplate = (item) => (
    <img
      src={item.url}
      alt={item.originalFileName}
      style={{ width: "100%", display: "block" }}
    />
  );
  const thumbnailTemplate = (item) => (
    <img
      src={item.url}
      alt={item.originalFileName}
      style={{ width: "80px", display: "block" }}
    />
  );

  return (
    <>
      <main className="auction-detail-page">
        <Button
          label="Voltar para a lista"
          icon="pi pi-arrow-left"
          className="p-button-text p-mb-4"
          onClick={() => navigate(-1)}
        />
        <div className="auction-grid">
          <section className="gallery-section">
            <Galleria
              value={auction.images}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              numVisible={4}
            />
          </section>

          <aside className="info-section">
            <div className="card">
              <Tag
                className="auction-status-tag"
                value={statusLabel[auction.status]}
              />
              <h1 className="auction-title">{auction.title}</h1>
              <div className="auction-category">{auction.categoryName}</div>
              <div className="auction-period">
                <span>Início: {formatDateBRL(auction.startDate)}</span>
                <span>Término: {formatDateBRL(auction.endDate)}</span>
              </div>
              {auction.status !== "OPEN" && auction.status !== "IN_PROGRESS" ? (
                <div className="price-info">
                  <Tag
                    className="auction-status-tag"
                    value={`Leilão ${statusLabel[auction.status]}`}
                  />

                  <h4 className="mt-3">
                    Este leilão não está mais aceitando lances.
                  </h4>
                </div>
              ) : user ? (
                <AuctionBidComponent auction={auction} />
              ) : (
                <>
                  <div className="price-info">
                    <div className="price-item">
                      <small>Lance Atual</small>
                      <strong className="current-bid">
                        {formatCurrencyBRL(auction.currentPrice)}
                      </strong>
                    </div>
                    <div className="price-item">
                      <small>Incremento Mínimo</small>
                      <strong>
                        {formatCurrencyBRL(auction.incrementValue)}
                      </strong>
                    </div>
                  </div>
                  <Button
                    label="Entrar para dar lance"
                    className="btn-enter"
                    onClick={() => navigate("/login")}
                  />
                </>
              )}
              {auction.seller && (
                <div className="seller-info">
                  Vendido por <strong>{auction.seller.name}</strong>
                </div>
              )}
            </div>
          </aside>

          <section className="description-section card">
            <h2>Descrição</h2>
            <p>{auction.description}</p>
            {auction.detailsDescription && (
              <>
                <h3>Detalhes Adicionais</h3>
                <p>{auction.detailsDescription}</p>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default AuctionDetailPage;
