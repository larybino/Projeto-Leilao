import api from '../config/axiosConfig';

class FeedbackService {
    
    async create(auctionId, feedbackData) {
        const response = await api.post(`/api/auctions/${auctionId}/feedback`, feedbackData);
        return response;
    }

    async getForUser(personId, page = 0, size = 10) {
        const response = await api.get(`/api/persons/${personId}/feedbacks?page=${page}&size=${size}`);
        return response;
    }
}

const feedbackService = new FeedbackService();
export default feedbackService;