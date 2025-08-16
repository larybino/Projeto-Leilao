import BaseService from "./BaseService";

class PersonService extends BaseService {
  constructor() {
    super("/person");
  }

  register(data) {
    return this.api.post(`${this.endPoint}/register`, data);
  }

  async recoverPassword(emailData) {
    const response = await this.api.post(
      `${this.endPoint}/recover-password`,
      emailData
    );
    return response;
  }

  async resetPassword(resetData) {
    const response = await this.api.post(
      `${this.endPoint}/reset-password`,
      resetData
    );
    return response;
  }

  async changePassword(changeData) {
    const response = await this.api.post(
      `${this.endPoint}/change-password`,
      changeData
    );
    return response;
  }
}
const personService = new PersonService();
export default personService;
