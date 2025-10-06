import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import feedbackService from '../service/FeedbackService';

function FeedbackList({ userId }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            feedbackService.getForUser(userId)
                .then(response => setFeedbacks(response.data.content))
                .catch(() => console.error("Não foi possível carregar os feedbacks."))
                .finally(() => setLoading(false));
        }
    }, [userId]);

    const itemTemplate = (feedback) => {
        return (
            <div className="col-12">
                <div className="p-3 border-1 surface-border surface-card border-round mb-2">
                    <div className="flex justify-content-between align-items-center mb-2">
                        <div className="font-medium">
                            <i className="pi pi-user mr-2"/>
                            {feedback.author.name}
                        </div>
                        <Rating value={feedback.rating} readOnly cancel={false} />
                    </div>
                    <div className="text-sm text-600 mb-2">
                        Sobre o leilão: <span className="font-italic">{feedback.auction.title}</span>
                    </div>
                    {feedback.comment && <div className="line-height-3 text-700">"{feedback.comment}"</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <h4>Feedbacks Recebidos</h4>
            <DataView value={feedbacks} itemTemplate={itemTemplate} loading={loading} emptyMessage="Este usuário ainda não recebeu feedbacks." />
        </div>
    );
}

export default FeedbackList;