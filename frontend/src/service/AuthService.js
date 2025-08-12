import BaseService from './BaseService';

class AuthService extends BaseService {
    constructor() {
        super('/auth');
    }

async login(credentials) {
    const response = await this.api.post(`${this.endPoint}/login`, credentials);
    return response;
  }
}

export default AuthService;