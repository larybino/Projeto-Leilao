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
}
const auctionService = new AuctionService();
export default auctionService;
