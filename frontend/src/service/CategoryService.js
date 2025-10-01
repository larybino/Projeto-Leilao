import BaseService from "./BaseService";

class CategoryService extends BaseService {
  constructor() {
    super("/categories");
  }
}
const categoryService = new CategoryService();
export default categoryService;
