import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Galleria } from "primereact/galleria";
import { Rating } from "primereact/rating";
import auctionService from "../service/AuctionService";
import PublicHeader from "../component/layout/PublicHeader";
import { formatCurrencyBRL, formatDateBRL } from "../utils/formatters";
import "./styles.css";

function AuctionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    auctionService
      .getPublicAuctionById(id)
      .then((response) => {
        setAuction(response.data);
        document.title = `${response.data.title} — App Leilão`; // SEO Básico
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
      <PublicHeader />
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
              <Tag className="auction-status-tag" value={auction.status} />{" "}
              <h1 className="auction-title">{auction.title}</h1>
              <div className="auction-category">{auction.categoryName}</div>
              <div className="auction-period">
                <span>Início: {formatDateBRL(auction.startDate)}</span>
                <span>Término: {formatDateBRL(auction.endDate)}</span>
              </div>
              <div className="price-info">
                <div className="price-item">
                  <small>Lance Mínimo</small>
                  <strong>{formatCurrencyBRL(auction.minBid)}</strong>
                </div>
                <div className="price-item">
                  <small>Maior Lance Atual</small>
                  <strong className="current-bid">
                    {formatCurrencyBRL(auction.highestBid)}
                  </strong>
                </div>
              </div>
              <Button
                label="Entrar para dar lance"
                className="btn-enter"
                onClick={() => navigate("/login")}
              />
              {auction.seller && (
                <div className="seller-info">
                  Vendido por <strong>{auction.seller.name}</strong>
                  <div className="seller-rating">
                    <Rating
                      value={auction.seller.averageRating}
                      readOnly
                      cancel={false}
                    />
                    <span>({auction.seller.feedbackCount} avaliações)</span>
                  </div>
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
