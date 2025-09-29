import BaseService from "./BaseService";

class CategoryService extends BaseService {
  constructor() {
    super("/category");
  }
}
const categoryService = new CategoryService();
export default categoryService;
