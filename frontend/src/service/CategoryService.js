import BaseService from "./BaseService";

class CategoryService extends BaseService {
  constructor() {
    super("/categories");
  }
  
  async getAll(searchTerm = "") {
    let url = this.endPoint;
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    const response = await this.api.get(url);
    return response;
  }
}
const categoryService = new CategoryService();
export default categoryService;
