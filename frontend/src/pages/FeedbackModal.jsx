import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import feedbackService from '../service/FeedbackService';

function FeedbackModal({ auction, visible, onHide, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, selecione uma nota.' });
            return;
        }
        setLoading(true);
        try {
            await feedbackService.create(auction.id, { rating, comment });
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Feedback enviado!' });
            onSuccess();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: error.response?.data || 'Não foi possível enviar o feedback.' });
        } finally {
            setLoading(false);
        }
    };
    
    const footer = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            <Button label="Enviar Feedback" icon="pi pi-check" onClick={handleSubmit} loading={loading} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog header={`Feedback para o vendedor: ${auction?.seller?.name}`} visible={visible} style={{ width: '450px' }} footer={footer} onHide={onHide}>
                <div className="p-fluid">
                    <div className="field">
                        <label>Nota (1 a 5)</label>
                        <Rating value={rating} onChange={(e) => setRating(e.value)} cancel={false} className="mt-2" />
                    </div>
                    <div className="field mt-4">
                        <label htmlFor="comment">Comentário (opcional)</label>
                        <InputTextarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} autoResize />
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default FeedbackModal;