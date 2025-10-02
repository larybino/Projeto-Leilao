import BaseService from "./BaseService";

class ImgService extends BaseService {
  constructor() {
    super("/imgs");
  }
  
}
const imgService = new ImgService();
export default imgService;
