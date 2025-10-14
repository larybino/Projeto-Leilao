import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useAuth } from "../service/AuthContext";
import auctionService from "../service/AuctionService";
import FeedbackModal from "../pages/FeedbackModal";
import "./styles.css";

function MyAuctionsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const fetchAuctions = () => {
    setLoading(true);
    auctionService
      .getAll()
      .then((response) => {
        const wonAuctions = response.data.content.filter(
          (auc) => auc.winner?.id === user.id
        );
        setAuctions(wonAuctions);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchAuctions();
    }
  }, [user]);

  const openFeedbackModal = (auction) => {
    setSelectedAuction(auction);
    setFeedbackModalVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.status === "CLOSED") {
      return (
        <Button
          label="Dar Feedback"
          icon="pi pi-comments"
          className="p-button-sm p-button-outlined"
          onClick={() => openFeedbackModal(rowData)}
        />
      );
    }
    return null;
  };

  return (
    <>
      <DataTable
        value={auctions}
        loading={loading}
        emptyMessage="Você ainda não arrematou nenhum leilão."
      >
        <Column field="title" header="Leilão" />
        <Column field="seller.name" header="Vendedor" />
        <Column
          header="Status"
          body={(rowData) => (
            <Tag className="auction-status-tag" value={rowData.status} />
          )}
        />{" "}
      </DataTable>

      {selectedAuction && (
        <FeedbackModal
          auction={selectedAuction}
          visible={isFeedbackModalVisible}
          onHide={() => setFeedbackModalVisible(false)}
          onSuccess={() => {
            setFeedbackModalVisible(false);
            fetchAuctions();
          }}
        />
      )}
    </>
  );
}

export default MyAuctionsPage;
