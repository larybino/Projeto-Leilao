import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Galleria } from 'primereact/galleria';
import imgService from '../service/ImgService';

function ImgForm({ auctionId }) {
    const [images, setImages] = useState([]);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const fetchImages = () => {
        imgService.getForAuction(auctionId)
            .then(response => setImages(response.data))
            .catch(() => toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar imagens.' }));
    };

    useEffect(() => {
        if (auctionId) {
            fetchImages();
        }
    }, [auctionId]);

    const customUploader = async (event) => {
        const file = event.files[0];
        try {
            await imgService.upload(auctionId, file);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem enviada!' });
            fetchImages(); 
            fileUploadRef.current.clear();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha no upload.' });
        }
    };

    const handleDelete = async (imageId) => {
        try {
            await imgService.delete(imageId);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem removida.' });
            fetchImages();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao remover imagem.' });
        }
    };

    const itemTemplate = (item) => (
        <div className="image-gallery-item">
            <img src={item.url} alt={item.originalFileName} className="gallery-main-image" />
            <Button 
                icon="pi pi-trash" 
                className="btn-delete" 
                onClick={() => handleDelete(item.id)}
            />
        </div>
    );

    const thumbnailTemplate = (item) => (
        <img src={item.url} alt={item.originalFileName} className="gallery-thumbnail-image" />
    );

   return (
        <div className="card">
            <Toast ref={toast} />
            
            <h5 className="image-manager-title">Upload de Novas Imagens</h5>
            <FileUpload
                ref={fileUploadRef}
                name="file"
                customUpload
                uploadHandler={customUploader}
                accept="image/*"
                maxFileSize={5000000} 
                emptyTemplate={<p className="m-0">Arraste e solte imagens aqui, ou clique para selecionar.</p>}
                chooseLabel="Selecionar"
                uploadLabel="Enviar"
                cancelLabel="Cancelar"
            />

            <h5 className="image-manager-title">Imagens Atuais</h5>
            {images.length > 0 ? (
                <Galleria 
                    value={images} 
                    item={itemTemplate} 
                    thumbnailsPosition="bottom" 
                    thumbnail={thumbnailTemplate} 
                    numVisible={5} 
                    style={{ maxWidth: '640px' }} 
                />
            ) : (
                <p>Nenhuma imagem cadastrada para este leilão.</p>
            )}
        </div>
    );
}


export default ImgForm;