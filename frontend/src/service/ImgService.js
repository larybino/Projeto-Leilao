import api from '../config/axiosConfig';

class ImgService {
    
    async upload(auctionId, file, onUploadProgress) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`auctions/${auctionId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
        return response;
    }

    async getForAuction(auctionId) {
        const response = await api.get(`auctions/${auctionId}/images`);
        return response;
    }

    async delete(imageId) {
        const response = await api.delete(`auctions/0/images/${imageId}`); 
        return response;
    }
}

const imgService = new ImgService();
export default imgService;