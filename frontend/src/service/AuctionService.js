import BaseService from "./BaseService";

class AuctionService extends BaseService {
  constructor() {
    super("/auctions");
  }

  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            params.append(key, filters[key]);
        }
    });
    
    const url = `${this.endPoint}?${params.toString()}`;
    const response = await this.api.get(url);
    return response;
  }

   async getPublicAuctions(filters = {}, page = 0, size = 9, sort = 'endDate,asc') {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.showPast) params.append('showPast', filters.showPast);
    
    params.append('page', page);
    params.append('size', size);
    params.append('sort', sort);

    const response = await this.api.get(`/auction/public?${params.toString()}`);
    return response;
  }

  async getPublicAuctionById(id) {
    const response = await this.api.get(`/auction/public/${id}`);
    return response;
  }
}
const auctionService = new AuctionService();
export default auctionService;
