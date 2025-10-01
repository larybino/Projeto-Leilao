import BaseService from "./BaseService";

class AuctionService extends BaseService {
  constructor() {
    super("/auction");
  }
}
const auctionService = new AuctionService();
export default auctionService;
